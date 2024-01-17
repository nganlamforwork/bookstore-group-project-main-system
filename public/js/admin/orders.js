const orderTemplateString = `
{{#each orders}}
<tr>
  <td>{{this.index}}</td>
  <td>{{this.customer_name}}</td>
  <td>
    {{#each products}}
    <p>{{book.title}}</p>
    {{/each}}
  </td>
  <td>
    {{#each products}}
    <p>{{quantity}}</p>
    {{/each}}
  </td>
  <td>
    {{#each products}}
    <p><span>$</span>{{book.price}}</p>
    {{/each}}
  </td>
  <td><span>$</span>{{this.subTotal}}</td>
  <td>{{created_at}}</td>
</tr>
{{/each}}
`

function renderData(data) {
  var orderTemplate = Handlebars.compile(orderTemplateString);
  var orderHtml = orderTemplate(data);
  document.getElementById("admin-order-table").innerHTML = orderHtml;

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
    url: "/admin/orders/filter" + params,
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