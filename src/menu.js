import React, { useState, useEffect, useRef } from "react";
import { Switch } from "antd";

function createItem(wrap, item, cookie, csrf) {
  const container = document.createElement("a");
  container.href = item.uri;
  container.target = "_blank";
  container.style.display = "block";
  container.style.width = "200px";
  container.style.background = "#ffffff";
  container.style.borderRadius = "10px";
  container.style.margin = "10px";
  container.style.overflow = "hidden";

  const img = document.createElement("img");
  img.src = item.pic + "@412w_232h_1c";
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
  const footer = document.createElement("div");
  footer.style.display = "flex";
  footer.style.justifyContent = "space-between";
  footer.style.padding = "0 10px";
  container.appendChild(footer);
  const owner = document.createElement("a");
  owner.innerHTML = item.owner.name;
  owner.href = "https://space.bilibili.com/" + item.owner.mid;
  owner.target = "_blank";
  owner.style.display = "block";
  owner.style.color = "#999";
  footer.appendChild(owner);
  const later = document.createElement("div");
  later.innerHTML = "Later";
  later.style.color = "#999";
  later.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const data = new FormData();
    data.append("aid", item.id);
    data.append("csrf", csrf);
    console.log("formData", data, item.id, csrf);
    fetch("https://api.bilibili.com/x/v2/history/toview/add", {
      method: "POST",
      credentials: "include",
      headers: {
        cookie
      },
      body: data
    });
  });
  footer.appendChild(later);
  wrap.insertBefore(container, wrap.firstElementChild);
}

function getRcmd(check) {
  window.check = check;

  const app = document.querySelector("#app");
  const footer = document.querySelector(".international-footer");
  let flow = document.querySelector("#bilibili-videoflow");
  if (window.check) {
    app.style.display = "none";
    footer.style.display = "none";
    if (!flow) {
      flow = document.createElement("div");
      flow.id = "bilibili-videoflow";
      flow.style.width = "440px";
      flow.style.height = "100%";
      flow.style.margin = "auto";
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
      const flowInner = document.createElement("div");
      flowInner.id = "bilibili-videoflow-inner";
      flowInner.style.width = "100%";
      flowInner.style.height = "100%";
      flowInner.style.display = "flex";
      flowInner.style.flexFlow = "row wrap";
      flowInner.style.background = "#afafaf";
      flowInner.style.overflowY = "auto";
      const empty = document.createElement("div");
      empty.style.display = "none";
      flowInner.appendChild(empty);
      flow.appendChild(flowInner);
    }
    flow.style.display = "block";
  } else {
    app.style.display = "block";
    footer.style.display = "block";
    if (flow) {
      flow.style.display = "none";
    }
  }

  const cookie = document.cookie;
  const csrf = cookie
    .split(";")
    .map((item) => item.split("="))
    .find((item) => item[0].trim() === "bili_jct")[1];
  const flowInner = document.querySelector("#bilibili-videoflow-inner");
  fetch(
    "https://api.bilibili.com/x/web-interface/index/top/rcmd?fresh_type=3",
    { credentials: "include" }
  )
    .then((res) => res.json())
    .then((res) => {
      console.log("fetch", res.data.item);
      res.data.item.forEach((item) => {
        createItem(flowInner, item, cookie, csrf);
      });
    });
}

const Menu = () => {
  const [checked, setChecked] = useState(false);
  const checkedRef = useRef();
  checkedRef.current = checked;
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
      <h4>BiliBili VideoFlow</h4>
      <Switch checked={checked} onChange={onChange} />
    </div>
  );
};

export default Menu;
