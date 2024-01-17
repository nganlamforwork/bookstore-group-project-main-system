const customersTemplateString = `
{{#each users}}
            <tr>
              <td class="text-truncate">
                {{this.index}}
              </td>
              <td class="text-truncate">
                {{this.first_name}}
              </td>
              <td class="text-truncate">
                {{this.last_name}}
              </td>
              <td class="text-truncate">
                {{this.email}}
              </td>
              <td class="text-truncate">
                {{this.phone}}
              </td>
              <td class="text-wrap">
                {{{this.default_address}}}
              </td>
              <td>
                <div class="flex d-flex justify-content-start gap-4">
                  <a href="/admin/customers/{{this._id}}" class="btn p-0">
                    <i class="fa-solid fa-eye"></i>
                  </a>
                  <form
                    action="/admin/customers/{{this._id}}/delete"
                    method="POST"
                  >
                    <button type="submit" class="btn text-danger p-0">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          {{/each}}
`

function renderData(data) {
  var customersTemplate = Handlebars.compile(customersTemplateString);
  var customersHtml = customersTemplate(data);
  document.getElementById("admin-customers-table").innerHTML = customersHtml;

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
    url: "/admin/customers/filter" + params,
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