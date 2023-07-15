let startDate = moment().subtract(1, 'months')
let endDate = moment()
let totalCommits = 0
let totalDays = endDate.diff(startDate, 'days')
let averageCommits = 0
let accessToken = null

let commitViewerLeftHtml = `
<div id="commit-viewer-left" class="commit-viewer-left">
  <div class="commit-viewer-control-component">
    <input type="text" id="commit-viewer-date-range" class="form-control" />
    <div id="commit-viewer-reload-btn" class="btn btn-primary ml-2">
      <svg t="1679063487021" style="color: #ffffff" class="octicon mr-2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2983" width="16" height="16"><path d="M347.648 841.376c42.24 19.392 89.248 30.208 138.752 30.208 183.808 0 332.8-148.992 332.8-332.8 0-68.096-20.448-131.424-55.552-184.16l73.504-73.504C890.24 353.248 921.6 442.368 921.6 538.784c0 240.352-194.848 435.2-435.2 435.2-67.424 0-131.264-15.328-188.224-42.688l7.328 27.392c7.328 27.328-8.896 55.392-36.192 62.72s-55.392-8.896-62.72-36.192l-39.744-148.352c-7.328-27.328 8.896-55.392 36.192-62.72L351.392 734.4c27.328-7.328 55.392 8.896 62.72 36.192s-8.896 55.392-36.192 62.72l-30.272 8.128zM589.28 115.84l-21.056-36.448c-14.144-24.48-5.76-55.808 18.752-69.952s55.808-5.76 69.952 18.752l76.8 133.024c14.144 24.48 5.76 55.808-18.752 69.952l-133.024 76.8c-24.48 14.144-55.808 5.76-69.952-18.752s-5.76-55.808 18.752-69.952l14.08-8.128a334.88 334.88 0 0 0-58.432-5.12c-183.808 0-332.8 148.992-332.8 332.8 0 40.64 7.296 79.616 20.64 115.616l-77.792 77.792C67.488 673.952 51.2 608.288 51.2 538.816c0-240.352 194.848-435.2 435.2-435.2 35.424 0 69.888 4.224 102.88 12.224z" p-id="2984"></path></svg>
      Reload
    </div>
  </div>
  <div class="commit-viewer-chart"></div>
</div>
`


// 页面加载完成后，初始化 CommitViewer 组件
$(function () {
  injectCommitViewerButton()
  injectCommitViewer()
})


// 发送消息至 background
function messageToBackground(msgType, callbackFunc) {
  chrome.runtime.sendMessage(msgType, callbackFunc)
}


// 初始化，在页面注入button
function injectCommitViewerButton() {
  let codeButtonEl = document.querySelector('#code-tab')
  let issuesButtonEl = document.querySelector('#issues-tab')
  let prButtonEl = document.querySelector('#pull-requests-tab')
  if (codeButtonEl && issuesButtonEl && prButtonEl) {
    $(".UnderlineNav-body").append(`
      <li data-view-component="true" class="d-inline-flex">
        <a id="commit-viewer-tab" data-tab-item="i8commit-viewer-tab" data-selected-links="code_review_limits codespaces_repository_commit-viewer collaborators custom_tabs hooks integration_installations interaction_limits issue_template_editor key_links_commit-viewer notifications repo_actions_commit-viewer repo_announcements repo_branch_commit-viewer repo_keys_commit-viewer repo_pages_commit-viewer repo_rule_insights repo_rulesets repo_protected_tags_commit-viewer repo_commit-viewer reported_content repo_custom_properties repository_actions_commit-viewer_add_new_runner repository_actions_commit-viewer_general repository_actions_commit-viewer_runners repository_environments role_details secrets secrets_commit-viewer_actions secrets_commit-viewer_codespaces secrets_commit-viewer_dependabot security_analysis /chubxu/DevToolBox/commit-viewer" data-pjax="#repo-content-pjax-container" data-turbo-frame="repo-content-turbo-frame" data-analytics-event="{&quot;category&quot;:&quot;Underline navbar&quot;,&quot;action&quot;:&quot;Click tab&quot;,&quot;label&quot;:&quot;commit-viewer&quot;,&quot;target&quot;:&quot;UNDERLINE_NAV.TAB&quot;}" data-view-component="true" class="UnderlineNav-item no-wrap js-responsive-underlinenav-item js-selected-navigation-item">
          <svg t="1678628526431" class="octicon octicon-gear UnderlineNav-octicon d-none d-sm-inline" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3201" width="20" height="20">
            <path d="M505.477547 832c-184.96 0-368.64-129.706667-478.848-251.093333a102.698667 102.698667 0 0 1-0.085334-137.898667C136.837547 321.621333 320.517547 192 505.43488 192l6.912 0.042667 6.229333-0.042667c184.917333 0 368.682667 129.621333 478.976 250.922667 35.498667 39.381333 35.541333 98.645333 0.085334 137.941333-110.336 121.429333-294.4 251.136-480.170667 251.136l-5.845333-0.042667-6.144 0.042667z m12.288-64c164.693333 0 331.392-118.869333 432.469333-230.144a38.784 38.784 0 0 0-0.085333-52.010667c-101.034667-111.104-267.434667-229.888-431.189334-229.888L511.536213 256h-5.589333C341.59488 256 175.06688 374.784 74.032213 485.973333a38.784 38.784 0 0 0 0.085334 52.010667C175.06688 649.130667 341.59488 768 506.160213 768l5.632-0.042667 5.973334 0.042667z" p-id="3202"></path><path d="M512.048213 704a192.213333 192.213333 0 0 1-192-192c0-105.856 86.144-192 192-192s192 86.144 192 192-86.144 192-192 192zM512.09088 384a128.170667 128.170667 0 0 0-128.042667 128c0 70.570667 57.429333 128 128 128s128-57.429333 128-128S582.61888 384 512.09088 384z" p-id="3203"></path>
          </svg>
          <span data-content="CommitViewer">CommitViewer</span>
          <span id="commit-viewer-repo-tab-count" data-pjax-replace="" data-turbo-replace="" title="Not available" data-view-component="true" class="Counter"></span> 
        </a>
      </li>
    `)
  } 
}


// 初始化展示组件
function injectCommitViewer() {
  $('#commit-viewer-tab').on('click', function () {
    if ($('.commit-viewer-container').length > 0) {
      $('.commit-viewer-container').remove()
    } else {
      $('#repo-content-turbo-frame').before(`
        <div class="commit-viewer-container">
          ${commitViewerLeftHtml}
          <div class="commit-viewer-right">
            <h2 class="mb-3 h4">Commits Summarize</h2>
            <div class="my-3"></div>
            <div class="mt-2">
            <svg t="1679063706668" class="octicon octicon-book mr-2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5099" width="16" height="16"><path d="M771.56352 266.57792l0-70.53312L313.088 196.0448l269.78304 290.16064c16.896 18.18624 16.66048 46.44864-0.54272 64.33792L315.5968 827.9552l455.95648 0 0-42.58816c0-25.81504 21.00224-46.81728 46.81728-46.81728 25.81504 0 46.82752 21.00224 46.82752 46.81728l0 89.40544c0 25.81504-21.00224 46.82752-46.82752 46.82752L205.6192 921.6c-18.7904 0-35.70688-11.17184-43.07968-28.47744-7.3728-17.3056-3.70688-37.24288 9.3184-50.80064L484.1472 517.55008 171.32544 181.10464c-12.67712-13.64992-16.06656-33.49504-8.63232-50.5856C170.1376 113.43872 186.99264 102.4 205.6192 102.4l612.7616 0c25.81504 0 46.82752 21.00224 46.82752 46.82752l0 117.3504c0 25.81504-21.00224 46.82752-46.82752 46.82752C792.56576 313.40544 771.56352 292.4032 771.56352 266.57792z" p-id="5100"></path></svg>
              Total Commits: <span id="total-commits" class="font-weight-bold">${totalCommits}</span>
            </div>
            <div class="my-3"></div>
            <div class="mt-2">
              <svg t="1679064955369" class="octicon octicon-book mr-2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5359" width="16" height="16"><path d="M512 646.8c-2.2 0-4.4 0-6.6-0.2-2.2-0.2-4.4-0.2-6.6-0.4-2.2-0.2-4.4-0.4-6.6-0.8l-6.6-1.2c-2.2-0.4-4.4-1-6.4-1.4-2.2-0.6-4.2-1.2-6.4-1.8-2.2-0.6-4.2-1.4-6.2-2-2-0.8-4.2-1.6-6.2-2.4-2-0.8-4-1.8-6-2.6l-6-3c-2-1-3.8-2.2-5.8-3.2s-3.8-2.4-5.6-3.6c-1.8-1.2-3.6-2.4-5.4-3.8s-3.6-2.6-5.2-4c-1.8-1.4-3.4-2.8-5-4.4-1.6-1.4-3.2-3-4.8-4.6-1.6-1.6-3-3.2-4.6-4.8-1.4-1.6-3-3.4-4.4-5-1.4-1.8-2.8-3.4-4-5.2-1.4-1.8-2.6-3.6-3.8-5.4s-2.4-3.8-3.6-5.6c-1.2-1.8-2.2-3.8-3.2-5.8l-3-6c-1-2-1.8-4-2.6-6s-1.6-4.2-2.4-6.2c-0.8-2-1.4-4.2-2-6.2-0.6-2.2-1.2-4.2-1.8-6.4-0.6-2.2-1-4.2-1.4-6.4l-1.2-6.6c-0.4-2.2-0.6-4.4-0.8-6.6-0.2-2.2-0.4-4.4-0.4-6.6-0.2-2.2-0.2-4.4-0.2-6.6s0-4.4 0.2-6.6c0.2-2.2 0.2-4.4 0.4-6.6 0.2-2.2 0.4-4.4 0.8-6.6l1.2-6.6c0.4-2.2 1-4.4 1.4-6.4 0.6-2.2 1.2-4.2 1.8-6.4 0.6-2.2 1.4-4.2 2-6.2 0.8-2 1.6-4.2 2.4-6.2 0.8-2 1.8-4 2.6-6l3-6c1-2 2.2-3.8 3.2-5.8 1.2-1.8 2.4-3.8 3.6-5.6 1.2-1.8 2.4-3.6 3.8-5.4 1.4-1.8 2.6-3.6 4-5.2 1.4-1.8 2.8-3.4 4.4-5 1.4-1.6 3-3.2 4.6-4.8 1.6-1.6 3.2-3 4.8-4.6 1.6-1.4 3.4-3 5-4.4 1.8-1.4 3.4-2.8 5.2-4 1.8-1.4 3.6-2.6 5.4-3.8 1.8-1.2 3.8-2.4 5.6-3.6s3.8-2.2 5.8-3.2l6-3c2-1 4-1.8 6-2.6s4.2-1.6 6.2-2.4c2-0.8 4.2-1.4 6.2-2 2.2-0.6 4.2-1.2 6.4-1.8 2.2-0.6 4.2-1 6.4-1.4l6.6-1.2c2.2-0.4 4.4-0.6 6.6-0.8s4.4-0.4 6.6-0.4c2.2-0.2 4.4-0.2 6.6-0.2s4.4 0 6.6 0.2c2.2 0.2 4.4 0.2 6.6 0.4s4.4 0.4 6.6 0.8l6.6 1.2c2.2 0.4 4.4 1 6.4 1.4 2.2 0.6 4.2 1.2 6.4 1.8 2.2 0.6 4.2 1.4 6.2 2 2 0.8 4.2 1.6 6.2 2.4s4 1.8 6 2.6l6 3c2 1 3.8 2.2 5.8 3.2 1.8 1.2 3.8 2.4 5.6 3.6 1.8 1.2 3.6 2.4 5.4 3.8 1.8 1.4 3.6 2.6 5.2 4 1.8 1.4 3.4 2.8 5 4.4 1.6 1.4 3.2 3 4.8 4.6 1.6 1.6 3 3.2 4.6 4.8 1.4 1.6 3 3.4 4.4 5 1.4 1.8 2.8 3.4 4 5.2 1.4 1.8 2.6 3.6 3.8 5.4 1.2 1.8 2.4 3.8 3.6 5.6 1.2 1.8 2.2 3.8 3.2 5.8l3 6c1 2 1.8 4 2.6 6s1.6 4.2 2.4 6.2c0.8 2 1.4 4.2 2 6.2 0.6 2.2 1.2 4.2 1.8 6.4 0.6 2.2 1 4.2 1.4 6.4l1.2 6.6c0.4 2.2 0.6 4.4 0.8 6.6 0.2 2.2 0.4 4.4 0.4 6.6 0.2 2.2 0.2 4.4 0.2 6.6 0 2.2 0 4.4-0.2 6.6-0.2 2.2-0.2 4.4-0.4 6.6-0.2 2.2-0.4 4.4-0.8 6.6l-1.2 6.6c-0.4 2.2-1 4.4-1.4 6.4-0.6 2.2-1.2 4.2-1.8 6.4s-1.4 4.2-2 6.2c-0.8 2-1.6 4.2-2.4 6.2-0.8 2-1.8 4-2.6 6l-3 6c-1 2-2.2 3.8-3.2 5.8-1.2 1.8-2.4 3.8-3.6 5.6-1.2 1.8-2.4 3.6-3.8 5.4-1.4 1.8-2.6 3.6-4 5.2-1.4 1.8-2.8 3.4-4.4 5-1.4 1.6-3 3.2-4.6 4.8-1.6 1.6-3.2 3-4.8 4.6-1.6 1.4-3.4 3-5 4.4-1.8 1.4-3.4 2.8-5.2 4-1.8 1.4-3.6 2.6-5.4 3.8s-3.8 2.4-5.6 3.6c-1.8 1.2-3.8 2.2-5.8 3.2l-6 3c-2 1-4 1.8-6 2.6s-4 1.6-6.2 2.4c-2 0.8-4.2 1.4-6.2 2s-4.2 1.2-6.4 1.8c-2.2 0.6-4.2 1-6.4 1.4l-6.6 1.2c-2.2 0.4-4.4 0.6-6.6 0.8-2.2 0.2-4.4 0.4-6.6 0.4-2.2 0.2-4.4 0.2-6.6 0.2z m472.4-202.4H773.6c-1.8-7.2-4-14.2-6.4-21.2-2.4-7-5.2-14-8.2-20.6-3-6.8-6.2-13.4-9.8-20-3.6-6.6-7.4-12.8-11.4-19-4-6.2-8.4-12.2-13-18-4.6-5.8-9.4-11.4-14.4-17-5-5.4-10.2-10.6-15.8-15.6-5.4-5-11.2-9.8-17-14.4-5.8-4.6-12-8.8-18.2-12.8-6.2-4-12.6-7.8-19.2-11.4-6.6-3.6-13.2-6.8-20-9.8-6.8-3-13.8-5.6-20.8-8-7-2.4-14.2-4.6-21.4-6.4-7.2-1.8-14.4-3.4-21.8-4.6-7.4-1.2-14.6-2.2-22-2.8-7.4-0.6-14.8-1-22.2-1s-14.8 0.4-22.2 1c-7.4 0.6-14.8 1.6-22 2.8-7.4 1.2-14.6 2.8-21.8 4.6-7.2 1.8-14.4 4-21.4 6.4-7 2.4-14 5-20.8 8-6.8 3-13.4 6.2-20 9.8-6.6 3.6-13 7.4-19.2 11.4-6.2 4-12.2 8.4-18.2 12.8-5.8 4.6-11.6 9.4-17 14.4s-10.8 10.2-15.8 15.6-9.8 11-14.4 17c-4.6 5.8-9 11.8-13 18-4 6.2-7.8 12.6-11.4 19-3.6 6.6-6.8 13.2-9.8 20-3 6.8-5.8 13.6-8.2 20.6-2.4 7-4.6 14.2-6.4 21.2H39.6v135h211c1.8 7.2 4 14.2 6.4 21.4 2.4 7 5.2 14 8.2 20.8 3 6.8 6.2 13.4 9.8 20 3.6 6.6 7.4 12.8 11.4 19 4 6.2 8.4 12.2 13 18s9.4 11.4 14.4 17c5 5.4 10.2 10.6 15.8 15.8 5.4 5 11.2 9.8 17 14.4 5.8 4.6 12 8.8 18.2 13 6.2 4 12.6 7.8 19.2 11.4 6.6 3.6 13.2 6.8 20 9.8 6.8 3 13.8 5.6 20.8 8s14.2 4.6 21.4 6.4c7.2 1.8 14.4 3.4 21.8 4.6 7.4 1.2 14.6 2.2 22 2.8 7.4 0.6 14.8 1 22.2 1 7.4 0 14.8-0.4 22.2-1 7.4-0.6 14.8-1.6 22-2.8 7.4-1.2 14.6-2.8 21.8-4.6 7.2-1.8 14.4-4 21.4-6.4 7-2.4 14-5 20.8-8s13.4-6.2 20-9.8c6.6-3.6 13-7.4 19.2-11.4s12.2-8.4 18.2-13c5.8-4.6 11.6-9.4 17-14.4s10.8-10.2 15.8-15.8c5-5.4 9.8-11.2 14.4-17 4.6-5.8 9-11.8 13-18 4-6.2 7.8-12.6 11.4-19 3.6-6.6 6.8-13.2 9.8-20 3-6.8 5.8-13.6 8.2-20.8 2.4-7 4.6-14.2 6.4-21.4h211v-135z" p-id="5360" fill="#57606a"></path></svg>
              <span class="font-weight-bold" id="total-days">${totalDays}</span> Day's Average Commits: <span id="average-commits" class="font-weight-bold">${averageCommits}</span>
            </div>
          </div>
        </div>
      `)
      initControlComponent()
      initDrawScatter()
    }
  })
}


// 初始化控制组件事件：日期范围选择器、reload按钮事件
function initControlComponent() {
  // 绑定日期范围选择组件
  $('#commit-viewer-date-range').daterangepicker({
    "timePicker": true,
    "timePickerSeconds": true,
    "autoApply": true,
    "ranges": {
      "Today": [
        moment().startOf('day'),
        moment().endOf('day')
      ],
      "Yesterday": [
        moment().subtract(1, 'days').startOf('day'),
        moment().subtract(1, 'days').endOf('day')
      ],
      "Last 7 Days": [
        moment().subtract(7, 'days').startOf('day'),
        moment().endOf('day')
      ],
      "Last 365 Days": [
        moment().subtract(365, 'days').startOf('day'),
        moment().endOf('day')
      ],
      "This Month": [
        moment().startOf('month'),
        moment().endOf('month')
      ],
      "Last Month": [
        moment().subtract(1, 'months').startOf('month'),
        moment().subtract(1, 'months').endOf('month')
      ],
    },
    "alwaysShowCalendars": true,
    "startDate": startDate,
    "endDate": endDate,
    "opens": "center",
  }, (start, end, label) => {
    startDate = start
    endDate = end
    totalDays = endDate.diff(startDate, 'days')
  })

  // 绑定reload监听事件，点击后绘制
  $('#commit-viewer-reload-btn').on('click', () => {
    let startDateUTC = moment(startDate).utc().format('YYYY-MM-DDTHH:mm:ss')
    let endDateUTC = moment(endDate).utc().format('YYYY-MM-DDTHH:mm:ss')
    sendDrawScatterMessage({
      since: startDateUTC,
      until: endDateUTC,
      perPage: 100,
      accessToken: accessToken
    })
  })
}


// 初始绘制
function initDrawScatter() {
  sendDrawScatterMessage({
    since: moment().utc().subtract(1, 'months').format("YYYY-MM-DDTHH:mm:ss"),
    until: moment().utc().format("YYYY-MM-DDTHH:mm:ss"),
    perPage: 100,
    accessToken: accessToken
  })
}


// 发送绘图消息
function sendDrawScatterMessage(requestParams) {
  console.log('sendRequest: ', requestParams)
  messageToBackground({
    type: LIST_COMMITS,
    since: requestParams.since,
    until: requestParams.until,
    perPage: requestParams.perPage,
    accessToken: requestParams.accessToken,
  }, (res) => {})
}


// 真正绘图的方法
function drawScatter(response) {
  let maxCount = 0
  let minCount = 0
  let scatterDataArray = []
  let scatterDataObject = {}
  if (response && response.length > 0) {
    totalCommits = response.length
    response.forEach(({
      commit: {
        committer: {
          date
        }
      }
    }) => {
      if (date) {
        let day = moment.utc(date, "YYYY-MM-DD").format('YYYY-MM-DD')
        let hour = moment.utc(date, "YYYY-MM-DDTHH:mm:ss").hour() + 8

        if (scatterDataObject[day] === undefined) {
          scatterDataObject[day] = {}
        }

        if (scatterDataObject[day][hour] !== undefined) {
          scatterDataObject[day][hour]++
        } else {
          scatterDataObject[day][hour] = 1
        }

        maxCount = Math.max(maxCount, scatterDataObject[day][hour])
        minCount = Math.min(minCount, scatterDataObject[day][hour])
      }
    })
    Object.keys(scatterDataObject).forEach(day => {
      Object.keys(scatterDataObject[day]).forEach(hour => {
        let scatterData = [day, Number.parseInt(hour), scatterDataObject[day][hour]]
        scatterDataArray.push(scatterData)
      })
    })
    averageCommits = totalCommits / totalDays
    averageCommits = averageCommits.toFixed(2)
    
    $('#total-days').text(totalDays)
    $('#average-commits').text(averageCommits)
    $('#total-commits').text(totalCommits)
  }

  var dom = document.querySelector('.commit-viewer-chart');
  var myChart = echarts.init(dom, null, {
    renderer: 'canvas',
    useDirtyRect: false
  });
  var app = {};

  var option;

  const hours = [
    '12a', '1a', '2a', '3a', '4a', '5a', '6a',
    '7a', '8a', '9a', '10a', '11a',
    '12p', '1p', '2p', '3p', '4p', '5p',
    '6p', '7p', '8p', '9p', '10p', '11p'
  ];
  const data = scatterDataArray.map(function (item) {
    return [item[0], item[1], item[2]];
  });
  option = {
    tooltip: {
      position: 'top',
      formatter: function (params) {
        return (
          params.value[2] +
          ' commits in ' +
          hours[params.value[1]] +
          ' of ' +
          params.value[0]
        );
      }
    },
    grid: {
      left: 10,
      bottom: 10,
      right: 10,
      top: 20,
      containLabel: true
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
      splitLine: {
        show: true
      },
      axisLine: {
        show: true
      }
    },
    yAxis: {
      type: 'category',
      data: hours,
      splitLine: {
        show: true,
        interval: 5,
      },
      axisLine: {
        show: true
      }
    },
    series: [{
      name: 'Commit Counts',
      type: 'scatter',
      symbolSize: function (val) {
        return val[2] * 4;
      },
      data: data,
      animationDelay: function (idx) {
        return idx * 5;
      },
      itemStyle: {
        color: function ({
          data
        }) {
          let count = data[2]
          let radio = (count - minCount) / (maxCount - minCount)
          if (radio < 0.25) {
            return '#9be9a8'
          } else if (radio < 0.5) {
            return '#40c463'
          } else if (radio < 0.75) {
            return '#30a14e'
          } else {
            return '#216e39'
          }
        }
      }
    }]
  };
  if (option && typeof option === 'object') {
    myChart.setOption(option);
  }
  window.addEventListener('resize', myChart.resize);
}

// 接收消息的监听器
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  sendResponse('')
  if (request.request.type === LIST_COMMITS) {
    if (request.error) {
      $('#commit-viewer-left').replaceWith(`
        <div id="commit-viewer-error" class="commit-viewer-error">
          <div>${request.error}</div>
        </div>
      `)
    } else if (request.response.documentation_url && request.response.message) {
      $('#commit-viewer-left').replaceWith(`
        <div id="commit-viewer-error" class="commit-viewer-error">
          <div>${request.response.message}</div>
          <br/>
          <a href="${request.response.documentation_url}">${request.response.documentation_url}</a>
          <br/>
          <input id="commit-viewer-error-access-input" type="text" class="form-control commit-viewer-error-access-input" placeholder="Enter Access Token" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
          <br/>
          <div id="commit-viewer-error-reload-btn" class="btn btn-primary ml-2">
            <svg t="1679063487021" style="color: #ffffff" class="octicon mr-2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2983" width="16" height="16"><path d="M347.648 841.376c42.24 19.392 89.248 30.208 138.752 30.208 183.808 0 332.8-148.992 332.8-332.8 0-68.096-20.448-131.424-55.552-184.16l73.504-73.504C890.24 353.248 921.6 442.368 921.6 538.784c0 240.352-194.848 435.2-435.2 435.2-67.424 0-131.264-15.328-188.224-42.688l7.328 27.392c7.328 27.328-8.896 55.392-36.192 62.72s-55.392-8.896-62.72-36.192l-39.744-148.352c-7.328-27.328 8.896-55.392 36.192-62.72L351.392 734.4c27.328-7.328 55.392 8.896 62.72 36.192s-8.896 55.392-36.192 62.72l-30.272 8.128zM589.28 115.84l-21.056-36.448c-14.144-24.48-5.76-55.808 18.752-69.952s55.808-5.76 69.952 18.752l76.8 133.024c14.144 24.48 5.76 55.808-18.752 69.952l-133.024 76.8c-24.48 14.144-55.808 5.76-69.952-18.752s-5.76-55.808 18.752-69.952l14.08-8.128a334.88 334.88 0 0 0-58.432-5.12c-183.808 0-332.8 148.992-332.8 332.8 0 40.64 7.296 79.616 20.64 115.616l-77.792 77.792C67.488 673.952 51.2 608.288 51.2 538.816c0-240.352 194.848-435.2 435.2-435.2 35.424 0 69.888 4.224 102.88 12.224z" p-id="2984"></path></svg>
            Reload
          </div>
        </div>
      `)
      $('#commit-viewer-error-reload-btn').on('click', () => {
        let startDateUTC = moment(startDate).utc().format('YYYY-MM-DDTHH:mm:ss')
        let endDateUTC = moment(endDate).utc().format('YYYY-MM-DDTHH:mm:ss')
        accessToken = $('#commit-viewer-error-access-input').val()
        $('#commit-viewer-error').replaceWith(commitViewerLeftHtml)
        initControlComponent()
        sendDrawScatterMessage({
          since: startDateUTC,
          until: endDateUTC,
          perPage: 100,
          accessToken: accessToken
        })
      })
    } else {
      drawScatter(request.response)
    }
    
  }
  console.log(request)
});