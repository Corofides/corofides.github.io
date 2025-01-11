# Place in Time: Part 1

A friend asked me to take a look at their site. It's pretty cool as it shows historic pictures of Newcastle over the years on a map.
You can check it out here if you are so inclined.

[Place in Time](https://www.placeintime.co.uk/)

Anyway once I'd added tiling to it which is what they'd requested I decided to have another look at how the photos were 
being added on to the map. I'd had a brief play around with this years ago to make it somewhat more responsive. Mainly it
was a case of getting rid of duplicate queries. I hadn't left it in a great state though. We had a php file that contained
some JavaScript with some php inside.

```php
const features = [
        <?php while ($the_query->have_posts()) : $the_query->the_post();


        // Similar to what you had although I've formatted it a bit better.
        $image_src = "";
        $image = get_field('photo_upload');

        if (!empty($image) && array_key_exists('sizes', $image)) {

            if (array_key_exists('thumbnail', $image['sizes'])) {
                $image_src = $image['sizes']['thumbnail'];
            }

        }

        $accuracy = get_field('photo_accuracy');
        $direction = get_field('photo_view_direction');

        if (!$accuracy) {
            $accuracy = 'Unknown';
        }

        if (!$direction) {
            $direction = 'Unknown';
        }

        $location = get_field('photo_location');

        // Construct a feature. This is part of GeoJSON https://docs.mapbox.com/help/glossary/geojson/
        // we want to use this instead of pins as it gives us added features such as clustering. You can
        // access anything in properties and define anything you want here. Ideally, we'd move this all
        // out into functions and create an ajax function to grab it saving initial load time. I may look
        // into this later. Geometry describes the object on the map, at the moment a simple point will do.
        ?>
      {
        "type": "Feature",
        "properties": {
          "id": <?php the_ID(); ?>,
          "title": "<?php the_title(); ?>",
          "image": "<?= $image_src; ?>",
          "accuracy": "<?= get_stylesheet_directory_uri() . "/images/icons/position-" . $accuracy; ?>",
          "direction": "<?= get_stylesheet_directory_uri() . "/images/icons/direction-" . $direction; ?>",
          "date": "<?php the_field('photo_date'); ?>",
          "original_photo_link": "<?php the_field('photo_link_url'); ?>",
          "edit_post_link": '<?= $canEdit ? get_edit_post_link() : ""; ?>',
        },
        "geometry": {
          "type": "Point",
          "coordinates": [<?php echo is_array($location) ? $location['lng'] : 0; ?>, <?php echo is_array($location) ? $location['lat'] : 0; ?>],
        }
      },
        <?php endwhile;  ?>
    ];

```

This essentialy created a js array by using php to create the various elements. Lately I've been playing around with some
REST stuff in WordPress which I thought could be an interesting way of doing this.

To begin with I created a 'photos' rest endpoint. I wanted this to be a way of requesting both a single photo or all the
photos. I defined the endpoint as follows

``photos(/?(?P<id>\d+))?``

This says it will match against the /photos url or photos followed by a list of digits which is registered as the parameter
id.

```php
add_action('rest_api_init', function() {
    register_rest_route(
        'pit-api',
        'photos(/?(?P<id>\d+))?',
        [
            'methods' => ['GET'],
            'callback' => function (WP_REST_Request $request) {

                $params = $request->get_url_params();

                $is_singular = array_key_exists('id', $params);

                wp_send_json_success($is_singular);
                return;

            }
        ]
    );
});
```
Currently it just adds this endpoint to the site, and the callback checks if the parameter 'id' exists, if it does we 
know we are requesting a single photo, otherwise we want to return a list of all the photos.

Next, I took the original query that was being ran on the page and made some alterations to it. First we define some
arguments for the get_posts function. We want to grab the photos post type, and we want to return all of them in a single
pass. If we've been provided with an id we also pass the property 'p' to args which tells it to match against this id.

Running this we then get our posts.

Because my friend is using Advanced Custom Fields on his site and we don't need all the data posts returns we now need
to transform this into something more useful. To do this I run a map on the array, I take the element that I'm currently on
and grab any of the custom fields that I want, from this I then return an array with all the data that I need. We can
then use wp_send_json_success to send this as a json object.


```php
function (WP_REST_Request $request) {

    $params = $request->get_url_params();

    $is_singular = array_key_exists('id', $params);

    $args = array(
        'post_type' => 'photos',
        'posts_per_page' => -1
    );

    if ($is_singular) {

        $args['p'] = $params['id'];

    }

    $posts = get_posts($args);

    $posts_transformed = array_map(function($post) {

        $image_src = "";
        $image = get_field('photo_upload', $post->ID);

        if (!empty($image) && array_key_exists('sizes', $image)) {

            if (array_key_exists('thumbnail', $image['sizes'])) {
                $image_src = $image['sizes']['thumbnail'];
            }

        }

        $accuracy = get_field('photo_accuracy', $post->ID);
        $direction = get_field('photo_view_direction', $post->ID);

        if (!$accuracy) {
            $accuracy = 'Unknown';
        }

        if (!$direction) {
            $direction = 'Unknown';
        }

        $location = get_field('photo_location', $post->ID);
        $cooridinates = [0, 0];

        if (is_array($location)) {

            $cooridinates[0] = $location['lng'];
            $cooridinates[1] = $location['lat'];

        }

        return [
            'id' => $post->ID,
            'title' => $post->post_title,
            'image' => $image_src,
            'accuracy' => get_stylesheet_directory_uri() . "/images/icons/position-" . $accuracy,
            'direction' => get_stylesheet_directory_uri() . "/images/icons/direction-" . $direction,
            'date' => get_field('photo_date', $post->ID),
            'original_photo_link' => get_field('photo_link_url', $post->ID),
            'coordinates' => $cooridinates,
        ];

    }, $posts);

    wp_send_json_success($posts_transformed);
    return;
}
```

MapBox actually uses a thing called geojson. I could potentially transform my json on the client side but I have some
ideas for using this on another thing and thought it might be fun to just do it on the server. To do this I defined a 
custom function called send_geo_json, I based the function off the wp_send_json function.

The core of this is that we map our array again and transform it into a feature that fits within the geojson specification
after this we return it as a FeatureCollection.

```php
function send_geo_json($response, $status_code = null, $flags = 0) {

    if ( !headers_sent() ) {
        header( 'Content-Type: application/geo+json; charset=' . get_option( 'blog_charset' ) );
        if ( null !== $status_code ) {
            status_header( $status_code );
        }
    }

    // Take the response and encode it as a feature in geojson.
    $encoded_as_features = array_map(function($item) {

        return [
            'type' => 'Feature',
            'properties' => $item,
            'geometry' => array(
                'type' => 'point',
                'coordinates' => $item['coordinates']
            )
        ];

    }, $response);

    $geojson = [
        'type' => 'FeatureCollection',
        'crs' => [
            'type' => 'name',
            'properties' => [
                'name' => 'urn:ogc:def:crs:OGC:1.3:CRS84'
            ]
        ],
        'features' => $encoded_as_features,
    ];

    echo wp_json_encode($geojson, $flags);

    if ( wp_doing_ajax() ) {
        wp_die(
            '',
            '',
            array(
                'response' => null,
            )
        );
    } else {
        die;
    }

}
```

Finally we check the 'Content-Type' header of the request and if it's geojson, apparently the mime type for this was
'application/geo+json', we run our transform, otherwise we just send it as standard json.

```php
$content_type = $request->get_content_type();
                
// If this is a request for geojson, send as geojson, otherwise send as normal json.
if ($content_type && $content_type['subtype'] === 'geo+json') {
    send_geo_json($posts_transformed);
} else {
    wp_send_json_success($posts_transformed);
}

return;
```

Next I went back to the javascript that was rendering the map and replaced the data attribute with a link to our new REST
endpoint. However, when I did this I ran into a problem because MapBox was expecting you to link to a .geojson file and
not to an endpoint. This meant it wasn't setting the Content-Type so this didn't work.
```js
map.addSource('photos', {
  type: 'geojson',
  data: 'http://localhost:10083/wp-json/pit-api/photos/',
  cluster: true,
  clusterMaxZoom: 15,
  clusterRadius: 50,
});
```

After some intensive investigation of going through the MapBox docs.. googling, I googled, like the MapBox docs are almost
impossible to find things in. It turns out you can do a transformRequest on the map so that you can alter a request. I did
this and just targeted any sources that directly queried the site.
```js
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-1.605899, 54.967964],
    zoom: 11,
    transformRequest: (url, resourceType) => {

      if (resourceType === 'Source' && url.startsWith('<?= $blogUrl; ?>')) { // Todo: Remove php from here, probably a better way
            return {
                url: url,
                headers: { 'Content-Type': 'application/geo+json'}
            }
        }
    }
});
```

After doing this the page now loads the geojson from the rest endpoint putting the site back to visually how it was to 
begin with.

Okay, so why do this? It's not a thing my friend had requested and it took me a bit of time to do and frankly doesn't
really add anything to the site. There's a couple of reasons.

To begin with this site is slow, it has a lot of different historic images on it and it takes a while to load. I'd improved
this a while back by optimising the javascript so it only loaded one image at a time but it's still not fast. By having
an endpoint for requesting the geojson, it can now load the initial page without having to load all the geojson. The next
benefit is in future I'll be able to just focus my efforts on optimising the rest endpoint without worrying about the page
itself. It will be super easy to test if my improvements work.

Finally, well I kind of want to play around with maps in React Native. Since I don't want to have to collect a load of 
data or just make something useless I figured I could do this with Place in Time. I don't really want to duplicate the work
and since I'll need the same data in both places I may as well abstract(? there's a word but it's failing me right not) out.