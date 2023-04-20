import React from 'react';

function Update(props) {
  return (
    <div id={props.post.id}>
        <div>
            <h2>{props.post.author}</h2>
        </div>
        <div>
            <input type="text"></input>
        </div>
    </div>
  );
}

export default Update;