const subscribersTemplateString = `
{{#each subscribers}}
          <tr>
            <td class="text-truncate">
              {{this.index}}
            </td>
            <td class="text-truncate">
              {{this.email}}
            </td>
            <td class="text-truncate">
              {{this.created_at}}
            </td>
          </tr>
          {{/each}}
`

function renderData(data) {
  var subscribersTemplate = Handlebars.compile(subscribersTemplateString);
  var subscribersHtml = subscribersTemplate(data);
  document.getElementById("admin-subscribers-table").innerHTML = subscribersHtml;

  const paginationTemplateString = `
    <ul class="pagination" style="margin-top: 1rem; padding-left: 0.3rem">
      {{#loopTill totalPages}}
      <li class="page-item {{#ifEquals ../page index}}active{{/ifEquals}}">
        <a class="page-link" style="cursor: pointer; border-radius: 0.3125rem;"
          onclick="paging({{index}})">{{index}}</a>
      </li>
      {{/loopTill}}
    </ul>
`;

  Handlebars.registerHelper("ifEquals", function (arg1, arg2, options) {
    return arg1 === arg2 ? options.fn(this) : options.inverse(this);
  });

  Handlebars.registerHelper("loopTill", function (totalPages, options) {
    let result = "";
    for (let i = 1; i <= totalPages; i++) {
      result += options.fn({ index: i });
    }
    return result;
  });

  var paginationTemplate = Handlebars.compile(paginationTemplateString);
  var paginationHtml = paginationTemplate(data);
  document.getElementById("paginationWrapper").innerHTML = paginationHtml;
}

function paging(page) {
  params = "?page=" + page;

  $.ajax({
    url: "/admin/subscribers/filter" + params,
    type: "GET",
    dataType: "json",
    success: function (data) {
      renderData(data)
    },
    error: function (error) {
      console.log("Error:", error);
    },
  });
}