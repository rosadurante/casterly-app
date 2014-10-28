/** global define */

define('entriesList', ['jquery', 'underscore'], function ($, _) {
    'use strict';

    var template = '' +
        '<table class="entries table">' +
          '<thead><tr>' + 
            '<th>Date</th><th>Category</th><th>Amount</th><th>Description</th>' +
          '</tr></thead>'+
          '<tbody>' +
            '<% _.each(entries, function (item) { %>' +
            '<tr class="entry <%= item.category.name %>" >' +
                '<td class="date"> <%= item.when %> </td>' +
                '<td class="category"> <%= item.category.name %> </td>' +
                '<td class="amount"> <%= item.amount %> </td>' +
                '<td class="desc"> <%= item.description %> </td>' +
            '</tr>' +
            '<% }); %>' +
          '</tbody>' +
        '</table>';

    var EntryList = function (elementId, entries) {
        var t = _.template(template, {entries: entries});
        document.getElementById(elementId).innerHTML = t;
    };

    return EntryList;
});