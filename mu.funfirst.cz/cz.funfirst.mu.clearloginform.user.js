// ==UserScript==
// // @id             cz.funfirst.mu.clearloginform
// // @name           FunFirstMU Clear Login Form
// // @version        1.0
// // @namespace      
// // @author         Queria Sa-Tas <public@sa-tas.net>
// // @description    Clears default values (description) from login form to enable credentials autocomplete in browser.
// // @include        http://muonline.funfirst.cz/
// // @include        http://muonline.funfirst.cz/*.php
// // @run-at         document-end
// // ==/UserScript==
var lForm = document.forms.namedItem("uss_login_form");
lForm.elements.namedItem('uss_password').value = '';
lForm.elements.namedItem('uss_id').value = '';

