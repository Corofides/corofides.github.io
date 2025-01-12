# Place in Time: Part 2

So, one of the other tasks that I want to do is to reduce the time it takes to get the image data from the server. Now 
that I've moved the json into it's own REST endpoint this is easy to test without external factors such as js, or image 
responses polluting the data.

I ran the REST request five times to give me an idea of how long it was taking to respond.

| Request Number | Time |
| -------------- | ---- |
| 1 | 9.60s |
| 2 | 9.12s |
| 3 | 9.10s |
| 4 | 9.26s |
| 5 | 9.10s |
| Average | 9.23s |

As you can see above the REST response is kind of slow which is slowing down the page on the site significantly. After
working in WordPress for a while I know that the Database usually ends up slowing things down significantly expecially if
you are requesting a lot of post_meta. The site currently has 2633 photos on it and for each one of these we are doing 
multiple queries.

To start off I added a new function called get_photos which can be provided an ID. The idea of this function is that we
do a single sql query for all the data that we require instead of requesting the data bit by bit, in my experience this
can speed up the operation significantly. We then modify our transform to use this instead.

```php
function get_photos($id = false) {

    global $wpdb;

    $sql = "
      SELECT ID as id, 
        post_title as title, 
        pm1.meta_value as accuracy,
        pm2.meta_value as photo,
        pm3.meta_value as direction,
        pm4.meta_value as 'date',
        pm5.meta_value as 'original_photo_link',
        pm6.meta_value as 'location'
      FROM $wpdb->posts as p
      LEFT JOIN $wpdb->postmeta as pm1 ON (pm1.post_id = id AND pm1.meta_key = 'photo_accuracy')
      LEFT JOIN $wpdb->postmeta as pm2 ON (pm2.post_id = id AND pm2.meta_key = 'photo_upload')
      LEFT JOIN $wpdb->postmeta as pm3 ON (pm3.post_id = id AND pm3.meta_key = 'photo_view_direction')
      LEFT JOIN $wpdb->postmeta as pm4 ON (pm4.post_id = id AND pm4.meta_key = 'photo_date')
      LEFT JOIN $wpdb->postmeta as pm5 ON (pm5.post_id = id AND pm5.meta_key = 'photo_link_url')
      LEFT JOIN $wpdb->postmeta as pm6 ON (pm6.post_id = id AND pm6.meta_key = 'photo_location')
      WHERE p.post_status = 'publish' AND p.post_type = 'photos'
    ";

    if (is_numeric($id)) {
        $sql .= " AND p.id = %d";
    }

    $photos = $wpdb->get_results($wpdb->prepare($sql, $id));
    return $photos;
    
}
```

```php
$posts_transformed = array_map(function($post) {

    $image_src = "";

    if ($post->photo) {
        $image_src = wp_get_attachment_image_url($post->photo, 'thumbnail');
    }

    if (!$post->accuracy) {
        $post->accuracy = 'Unknown';
    }

    if (!$post->direction) {
        $post->direction = 'Unknown';
    }

    $location = unserialize($post->location);
    $cooridinates = [0, 0];

    if (is_array($location)) {
        $cooridinates[0] = $location['lng'];
        $cooridinates[1] = $location['lat'];
    }

    return [
        'id' => $post->id,
        'title' => $post->title,
        'image' => $image_src,
        'accuracy' => get_stylesheet_directory_uri() . "/images/icons/position-" . $post->accuracy,
        'direction' => get_stylesheet_directory_uri() . "/images/icons/direction-" . $post->direction,
        'date' => $post->date,
        'original_photo_link' => $post->original_photo_link, //get_field('photo_link_url', $post->ID),
        'coordinates' => $cooridinates,
    ];

}, $posts);
```

| Request Number | Time |
| -------------- | ---- |
| 1 | 2.56s |
| 2 | 2.60s |
| 3 | 2.55s |
| 4 | 2.65s |
| 5 | 2.55s |
| Average | 2.58s |

After doing this basic pass we've managed to reduce the response time to a third of it's initial value. This will definitely
improve the responsiveness of our site. However, I was curious if I could get a further reduction on this as it still seemed
fairly slow. After some trial and error I discovered the culprit that was causing the slowdown.

``$image_src = wp_get_attachment_image_url($post->photo, 'thumbnail');``

Grabbing the thumbnail for the photo attachment was doing multiple queries to the db, so for each of our photos we are
querying the database 2633(x) times, which reduces the performance. I found out that the thumbnail was being stored in the
postmeta table as a serialized array. I modified the query to grab this serialized array for the attachment instead and
then used some PHP to construct the url of the thumbnail in our transformation.

```php
function get_photos($id = false) {

    global $wpdb;

    $sql = "
      SELECT ID as id, 
        post_title as title, 
        pm1.meta_value as accuracy,
        pm3.meta_value as direction,
        pm4.meta_value as 'date',
        pm5.meta_value as 'original_photo_link',
        pm6.meta_value as 'location',
        pm7.meta_value as 'photo'
      FROM $wpdb->posts as p
      LEFT JOIN $wpdb->postmeta as pm1 ON (pm1.post_id = id AND pm1.meta_key = 'photo_accuracy')
      LEFT JOIN $wpdb->postmeta as pm2 ON (pm2.post_id = id AND pm2.meta_key = 'photo_upload')
      LEFT JOIN $wpdb->postmeta as pm3 ON (pm3.post_id = id AND pm3.meta_key = 'photo_view_direction')
      LEFT JOIN $wpdb->postmeta as pm4 ON (pm4.post_id = id AND pm4.meta_key = 'photo_date')
      LEFT JOIN $wpdb->postmeta as pm5 ON (pm5.post_id = id AND pm5.meta_key = 'photo_link_url')
      LEFT JOIN $wpdb->postmeta as pm7 on (pm2.meta_value = pm7.post_id AND pm7.meta_key = '_wp_attachment_metadata')
      LEFT JOIN $wpdb->postmeta as pm6 ON (pm6.post_id = id AND pm6.meta_key = 'photo_location')
      WHERE p.post_status = 'publish' AND p.post_type = 'photos'
    ";

    if (is_numeric($id)) {
        $sql .= " AND p.id = %d";
    }

    $photos = $wpdb->get_results($wpdb->prepare($sql, $id));

    return $photos;
}
```

```php
$photo_array = unserialize($post->photo);

$original_image_url = "";
$image = "";

if (is_array($photo_array)) {

    if (array_key_exists('file', $photo_array)) {
        $original_image_url = $photo_array['file'];
        $image = $photo_array['file'];
    }

    if (array_key_exists('sizes', $photo_array) && array_key_exists('thumbnail', $photo_array['sizes'])) {
        $image = $photo_array['sizes']['thumbnail']['file'];
    }

}

if ($original_image_url && $image) {
    $urlParts = explode('/', $original_image_url);
    $urlParts[count($urlParts) - 1] = $image;
    $image = $wp_upload_dir . '/' . implode('/', $urlParts);
}
```

| Request Number | Time |
| -------------- | ---- |
| 1 | 621ms |
| 2 | 610ms |
| 3 | 631ms |
| 4 | 611ms |
| 5 | 600ms |
| Average | 615ms |

As you can see we are now grabbing all 2633 photos and the data we need in under 1 second. While I could probably optimise
this further I think I'd now hit a case of diminishing returns at the cost of increased complexity so decided to leave this
here.