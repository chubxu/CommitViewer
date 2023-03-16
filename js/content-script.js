let startDate = moment().subtract(1, 'months')
let endDate = moment()
$(function () {
  injectCommitViewerButton()
  injectCommitViewer()
})

function messageToBackground(msgType, callbackFunc) {
  chrome.runtime.sendMessage(msgType, callbackFunc)
}

function injectCommitViewerButton() {
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

function injectCommitViewer() {
  $('#commit-viewer-tab').on('click', function () {
    if ($('.commit-viewer-container').length > 0) {
      $('.commit-viewer-container').remove()
    } else {
      $('#repo-content-turbo-frame').before(`
        <div class="commit-viewer-container">
          <div class="commit-viewer-left">
            <div class="commit-viewer-control-component">
              <input type="text" id="commit-viewer-date-range" class="form-control" />
              <div class="btn btn-primary ml-2" id="reload-btn">Reload</div>
            </div>
            <div class="commit-viewer-chart"></div>
          </div>

          <div class="commit-viewer-right">
            <h2 class="mb-3 h4">Commits Summarize</h2>
          </div>
        </div>
      `)

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
          "Last 30 Days": [
            moment().subtract(30, 'days').startOf('day'),
            moment().endOf('day')
          ],
          "This Month": [
            moment().startOf('month'),
            moment().endOf('month')
          ],
          "Last Month": [
            moment().subtract(1, 'months').startOf('month'),
            moment().subtract(1, 'months').endOf('month')
          ]
        },
        "alwaysShowCalendars": true,
        "startDate": startDate,
        "endDate": endDate,
        "opens": "center",
      }, (start, end, label) => {
        startDate = start
        endDate = end
      })

      // 绑定reload监听事件
      $('#reload-btn').on('click', () => {
        let startDateUTC = moment(startDate).utc().format('YYYY-MM-DDTHH:mm:ss')
        let endDateUTC = moment(endDate).utc().format('YYYY-MM-DDTHH:mm:ss')
        console.log(startDateUTC, endDateUTC)
      })
      sendDrawScatterMessage()
    }
  })
}

 // <div class="c-datepicker-date-editor J-datepicker-range-day mt10">
//   <i class="c-datepicker-range__icon kxiconfont icon-clock"></i>
//   <input placeholder="开始日期" name="" class="c-datepicker-data-input only-date" value="">
//   <span class="c-datepicker-range-separator">-</span>
//   <input placeholder="结束日期" name="" class="c-datepicker-data-input only-date" value="">
// </div>

function sendDrawScatterMessage() {
  
  let owner = 'chubxu'
  let repo = 'DevToolBox'
  let since = moment().utc().subtract(1, 'months').format("YYYY-MM-DDTHH:mm:ss")
  let until = moment().utc().format("YYYY-MM-DDTHH:mm:ss")
  let perPage = 100
  messageToBackground({
    type: LIST_COMMITS,
    owner: owner,
    repo: repo,
    since: since,
    until: until,
    perPage: perPage,
  }, (res) => {})
}

function drawScatter(response) {
  let maxCount = 0
  let minCount = 0
  let scatterDataArray = []
  let scatterDataObject = {}
  if (response && response.length > 0) {
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
    // title: {
    //   text: 'Commit View of Github'
    // },
    // legend: {
    //   data: ['Commit Counts'],
    //   left: 'left',
    //   itemStyle: {
    //     color: '#216e39'
    //   }
    // },
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  sendResponse('')
  if (request.request.type === LIST_COMMITS) {
    drawScatter(request.response)
  }
  console.log(request)
});