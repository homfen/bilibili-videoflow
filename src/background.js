function switchPanel() {
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
      flowInner.sytle.overflowY = "auto";
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
}

chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.get(activeInfo.tabId, async (tab) => {
    const url = tab.url;
    console.log("tab.url", url);
    if (url.indexOf("bilibili.com") > -1) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: switchPanel
      });
    }
  });
});
