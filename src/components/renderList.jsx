import React, { Component } from "react";

class RenderList extends Component {
  renderedList() {
    const data = this.props.data;
    const list = [];
    data.forEach((key, value) => {
      list.push(
        <a
          style={{ paddingRight: "20px", color: "blue", fontWeight: "bold" }}
          href={key}
          key={key}
        >
          {value}
        </a>
      );
    });
    return list;
  }
  render() {
    return <div className="px-5">{this.renderedList()}</div>;
  }
}

export default RenderList;
