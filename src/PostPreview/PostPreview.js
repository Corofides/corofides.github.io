import React from 'react';
import {DateTime} from 'luxon';
import './PostPreview.scss';
import usePost from '../Hooks/usePosts';


export default ({onClick, id}) => {

  const {getPost, loading} = usePost();

  if (loading) {
    return (
      <div>
        Loading
      </div>
    )
  }

  const {name, author, date_published} = getPost(id);

  const dateTime = DateTime.fromISO(date_published);

  return (
    <div onClick={() => {onClick(id)}} className={"PostPreview"}>
      <div className={"PostPreview__Image"} />
      <div className={"PostPreview__Info"}>
        <span className={"PostPreview__Published"}>{dateTime.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}</span>
        <h2 className={"PostPreview__Title"}>{name}</h2>
        <h3 className={"PostPreview__Author"}>By {author}</h3>
      </div>
    </div>
  )

}