const moment = require('moment');

module.exports = {
  truncate: function(str, len) {
    if (str.length > len && str.length > 0) {
      var new_str = str.substr(0, len);
      new_str = str.substr(0, new_str.lastIndexOf(" "));
      new_str = (new_str.length > 0) ? new_str : str.substr(0, len);
      return new_str + '...';
    }
    return str;
  },
  stripTags: function(input) {
    return input.replace(/<(?:.|\n)*?>/gm, '');
  },
  appDescription: function(techStackArray) {
    let appDescriptionHtml = '';
    if (techStackArray.length > 6) {
      techStackArray = techStackArray.slice(0, 6);
      techStackArray.forEach(function(tech) {
        appDescriptionHtml += `
        <li>
          ${tech}
        </li>`
      })
      appDescriptionHtml += `
        <li>
          Others
        </li>
      `
    } else {
      techStackArray.forEach(function(tech) {
        appDescriptionHtml += `
        <li>
          ${tech}
        </li>`
      });
    }
    return (
      `<div class="app_techstack valign-wrapper">
        <ul>
          ${appDescriptionHtml}
        </ul>
      </div>`
    )
  },
  formatDate: function(date, format) {
    return moment(date).format(format);
  },
  select: function(selected, options) {
    return options.fn(this).replace( new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"').replace( new RegExp('>' + selected + '</option>'), ' selected="selected"$&');
  },
  techStackCheck: function(techStackArray, techStack) {
    let match = false;
    techStackArray.forEach(function(tech) {
      if(tech === techStack) {
        match = true;
      }
    })    
    return match ? `checked="checked"` : '';
  },
  techStackView: function(techArray) {
    let techStackHtml = '';
    techArray.forEach(function(tech) {
      techStackHtml += `
        <div class="col m6 xl4 s12 valign-wrapper"> 
          <input type="checkbox" disabled="disabled" checked="checked"/>
          <label>${tech}</label>
        </div>
      `
    })
    return (
      `<div class="card valign-wrapper">
        <div class="card-content col s12">
          ${techStackHtml}
        </div>
      </div>`
    )
  },
  editIcon: function(appUser, loggedUser, appId, floating=true) {
    if(appUser === loggedUser) {
      if(floating){
        return `<a href="/apps/edit/${appId}" class="waves-effect waves-light btn-floating halfway-fab red"><i class="fa fa-pencil"></i></a>`;
      } else {
        return `<a href="/apps/edit/${appId}"><i class="fa fa-pencil"></i></a>`;
      }
    } else {
      return '';
    }
  },
  editComment: function(commentUser, loggedUser, appId, commentId) {
    if(commentUser === loggedUser) {
      return `<form id="delete-comment-${appId}-${commentId}" action="/apps/comment/${appId}/${commentId}?_method=DELETE" method="POST" onsubmit="return confirmDeleteComment()">
      <input type="hidden" name="_method" value="DELETE">
      <a href="javascript:;" onclick="confirmDeleteComment('${appId}', '${commentId}')">Delete</a>
      </form>`
    }
  },
  mobileFriendlyCheck: function(mobileFriendlyStatus) {
    if(mobileFriendlyStatus === 'no') {
      return `<small>Not Mobile Friendly</small>`
    }
  }
}