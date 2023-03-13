const messageToContentScript = (request, response, error) => {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      request,
      response,
      error
    }, (res) => {});
  });
}

const getCurrentTabUrl = async () => {
  let queryOptions = {
    active: true,
    currentWindow: true
  };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab.url;
}

const contentScriptMessageHandler = async (request) => {
  if (request.type === 'list_commits') {
    let currentTabUrlPromise = getCurrentTabUrl()
    currentTabUrlPromise.then(async (currentTabUrl) => {
      if (currentTabUrl && currentTabUrl.startsWith("https://github.com/")) {
        let ownerAndRepo = currentTabUrl.replace("https://github.com/", "").split("/")
        let owner = ownerAndRepo[0]
        let repo = ownerAndRepo[1]
        let url = `https://api.github.com/repos/${owner}/${repo}/commits?since=${request.since}&until=${request.until}&per_page=${request.perPage}`
        try {
          let response = await fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'application/vnd.github+json',
              'X-GitHub-Api-Version': '2022-11-28',
            }
          })
          let res = await response.json()
          messageToContentScript(request, res, null)
        } catch (err) {
          messageToContentScript(request, null, 'Request Github API Failed, the reason is: ' + err)
        }
      }
    })
  }
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  sendResponse('')
  contentScriptMessageHandler(request)
})