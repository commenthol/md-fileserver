## configuration

<style>
button {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
  cursor: pointer;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  user-select: none;
  padding: .375rem .75rem;
  font-size: 1rem;
  border-radius: .25rem;
}
select,
input:not([type=checkbox]) {
  box-sizing: border-box;
  display: block;
  width: 100%;
  height: calc(1.5em + .75rem + 2px);
  padding: .375rem .75rem;
  font-size: 1rem;
  font-weight: 400;
  color: var(--color-fg-secondary, #495057);
  background-color: var(--color-bg-primary, #fff);
  background-clip: padding-box;
  border: 1px solid var(--color-border-h1, #ced4da);
  border-radius: .25rem;
  transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
}
label {
  color: var(--color-fg-primary, inherit);
}
</style>

<a href="/">home</a>

---

<form method="post" action="/config">

<label for="port">Port</label> <small>requires restart</small><br>
<input id="port" name="port" type="number" min="1000" max="65535" value="<%= port %>">

<input id="filterMd" name="filter" type="checkbox" <%= filter ? 'checked' : '' %>>
<label for="filterMd">Show only markdown files in directory list</label>
<br>

<input id="confluencer" name="confluencer" type="checkbox" <%= confluencer ? 'checked' : '' %>>
<label for="confluencer">Use <a href="https://npmjs.com/package/confluencer">confluencer</a></label>
<br>

<input id="confluenceHtml" name="confluenceHtml" type="checkbox" <%= confluenceHtml ? 'checked' : '' %>>
<label for="confluenceHtml">Display Confluence html</label>
<br>

<input id="darkMode" name="darkMode" type="checkbox" <%= darkMode ? 'checked' : '' %>>
<label for="darkMode">Dark mode</label>
<br>

<label for="style">highlight.js style</label>
<br>
<select id="styles" name="highlight"><% for (var style of styles) { %><option value="<%- style %>" <%= template.highlight == style ? 'selected' : '' %>><%- style %></option><% } %></select>

<button type="submit">Submit</button>

</form>
