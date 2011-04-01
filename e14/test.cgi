#!/usr/bin/env python
# vim: set fileencoding=utf8

import cgi
import cgitb; cgitb.enable()
import re

print('Content-Type: text/html;')
print('')

prvni = 'ahoj'
druhy = 'nazdar'
treti = 'cau'

form = cgi.FieldStorage()
seznam = dict()

key_pattern = re.compile("^neco\[([^\]]+)\]\[([^\]]+)\]$")
for key in form.keys():
    print 'testing '+key+' ... '
    match = key_pattern.match(key)
    if match:
        print 'match'
        p1 = match.group(1)
        p2 = match.group(2)
        if not seznam.has_key(p1):
            seznam[p1] = dict();
        seznam[p1][p2] = form[key].value
    print '<br />'

def parse_deps(depstring):
    check = re.compile("^(([0-9]+)\*)?([\w-]+)$")
    match = check.match(depstring)
    print "parsing: " + depstring + " ... "
    if match:
        count = 1
        iid = match.group(3)
        if not match.group(2) == None:
            count = int(match.group(2))
        print "ok (c=%s, id=%s) " % (count, iid)
    else:
        print "bad format!"
    print "<br />"

print('<html><head>')
print('<meta http-equiv="content-type" content="text/html;charset=utf-8" />')
print('<title>calc</title>')
print('</head>')
print("""<body>
        <h1>E14 Calculator</h1>""")
print('<form action="./test.cgi" method="post"><div>')
print('<input type="text" name="neco[prvni][jmeno]" value="'+prvni+'" />')
print('<input type="text" name="neco[druhy][jmeno]" value="'+druhy+'" />')
print('<input type="text" name="neco[treti][jmeno]" value="'+treti+'" />')
print('<input type="submit" value="Recalculate" />')
print('</div></form>')

print ("<pre>")
#print form
print seznam
print("</pre>")

parse_deps("neco-jineho")
parse_deps("1neco-jineho")
parse_deps("1*neco-jineho")
parse_deps("56*neco-jineho")
#for f in form.keys():
#    print f
print('</body></html>')

