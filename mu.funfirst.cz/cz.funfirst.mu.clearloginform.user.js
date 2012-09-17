// ==UserScript==
// @author         Queria Sa-Tas <public@sa-tas.net>
// @namespace      http://github.com/queria/qs-userjs/
// @id             cz.funfirst.muonline.clearloginform
// @name           FunFirstMU Clear Login Form
// @version        1.1
// @updateURL      https://raw.github.com/queria/qs-userjs/master/mu.funfirst.cz/cz.funfirst.mu.clearloginform.user.js
// @include        http://muonline.funfirst.cz/
// @include        http://muonline.funfirst.cz/*.php
// @description    Clears default values (description) from login form to enable credentials autocomplete in browser.
// @run-at         document-end
// ==/UserScript==
var lForm = document.forms.namedItem("uss_login_form");
lForm.elements.namedItem('uss_password').value = '';
lForm.elements.namedItem('uss_id').value = '';

