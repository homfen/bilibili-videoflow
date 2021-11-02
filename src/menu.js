import React, { useState } from "react";
import { Switch } from "antd";

function createItem(wrap, item) {
  const container = document.createElement("div");
  container.style.width = "200px";
  container.style.background = "#ffffff";
  container.style.borderRadius = "10px";
  container.style.margin = "10px";
  container.style.overflow = "hidden";

  const img = document.createElement("img");
  img.src = item.pic;
  img.style.display = "block";
  img.style.width = "100%";
  container.appendChild(img);
  const title = document.createElement("div");
  title.style.height = "34px";
  title.style.display = "-webkit-box";
  title.style["-webkit-line-clamp"] = 3;
  title.style["-webkit-box-orient"] = "vertical";
  title.style.overflow = "hidden";
  title.style.textOverflow = "ellipsis";
  title.style.padding = "0 10px";
  title.innerHTML = item.title;
  container.appendChild(title);
  const owner = document.createElement("div");
  owner.innerHTML = item.owner.name;
  owner.style.padding = "0 10px";
  owner.style.color = "#999";
  container.appendChild(owner);
  wrap.appendChild(container);
}

function getRcmd(check) {
  const app = document.querySelector("#app");
  const footer = document.querySelector(".international-footer");
  let flow = document.querySelector("#bilibili-videoflow");
  let flowInner = document.querySelector("#bilibili-videoflow-inner");
  if (check) {
    app.style.display = "none";
    footer.style.display = "none";
    if (!flow) {
      flow = document.createElement("div");
      flow.id = "bilibili-videoflow";
      flow.style.width = "440px";
      flow.style.height = "100%";
      flow.style.margin = "auto";
      flow.style.flexFlow = "row wrap";
      flow.style.background = "#afafaf";
      flow.style.position = "relative";
      document.body.appendChild(flow);
      const refresh = document.createElement("div");
      refresh.innerHTML = "R";
      refresh.style.position = "absolute";
      refresh.style.right = "0px";
      refresh.style.top = "50%";
      refresh.style.width = "40px";
      refresh.style.height = "40px";
      refresh.style.textAlign = "center";
      refresh.style.lineHeight = "40px";
      refresh.style.background = "#afafaf";
      refresh.style.borderRadius = "20px";
      refresh.style.border = "2px solid #ffffff";
      refresh.style.marginRight = "-20px";
      refresh.style.cursor = "pointer";
      refresh.style.color = "white";
      refresh.style.fontSize = "20px";
      refresh.addEventListener("click", (e) => {
        getRcmd(true);
      });
      flow.appendChild(refresh);
      flowInner = document.createElement("div");
      flowInner.style.width = "100%";
      flowInner.style.height = "100%";
      flow.appendChild(flowInner);
    }
    flow.style.display = "flex";
    fetch(
      "https://api.bilibili.com/x/web-interface/index/top/rcmd?fresh_type=3",
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((res) => {
        res.data.item.forEach((item) => {
          createItem(flowInner, item);
        });
      });
  } else {
    app.style.display = "block";
    footer.style.display = "block";
    flow.style.display = "none";
  }
}

const Menu = () => {
  const [checked, setChecked] = useState(false);
  const onChange = async (check) => {
    setChecked(check);

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: getRcmd,
      args: [check]
    });
  };
  return (
    <div>
      <h2>BiliBili VideoFlow</h2>
      <Switch checked={checked} onChange={onChange} />
    </div>
  );
};

export default Menu;
