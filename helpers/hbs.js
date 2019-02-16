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
  formatDate: function(date, format) {
    return moment(date).format(format);
  },
  select: function(selected, options) {
    return options.fn(this).replace( new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"').replace( new RegExp('>' + selected + '</option>'), ' selected="selected"$&');
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
  }
}