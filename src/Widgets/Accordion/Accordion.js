import React, {useState} from 'react';
import { css } from 'glamor';


const Accordion = ({items, ...props}) => {

  const [open, setOpen] = useState([]);

  const accordionTitle = css({

    "padding": "8px",
    "backgroundColor": "#767676",
    "color": "#fff",
    "cursor": "pointer",
    "margin": "0",
    "borderBottom": "solid #fff 2px"

  });

  const accordionContent = css({
    "padding": "8px",
    "color": "#767676",
  });

  const onSelect = (id) => {

    const openIndex = open.findIndex((item) => {

      return item === id;

    });

    const newOpen = [...open];

    if (openIndex >= 0) {
      newOpen.splice(openIndex, 1);
      setOpen(newOpen);
      return;
    }

    newOpen.push(id);
    setOpen(newOpen);

  };

  return (
    <div>
      {items.map(({title, content}, index) => {

        return (
          <div key={index}>
            <h3 onClick={() => {onSelect(index)}} {...accordionTitle}>{title}</h3>
            {open.includes(index) ? <div {...accordionContent}>{content}</div> : null}
          </div>
        )

      })}
    </div>
  )

};

export default Accordion;