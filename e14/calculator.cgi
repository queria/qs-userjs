#!/usr/bin/env python
# vim: set fileencoding=utf8

import cgi
import cgitb; cgitb.enable()
import urllib
import json
import zlib
import bz2
import base64
import re
import sys
from datetime import datetime
from types import IntType
from unicodedata import normalize


def slugfy(text, separator):
    ret = u""
    ret = text.decode('utf-8').strip().lower()

    ret = normalize('NFKD', ret).encode('ascii', 'ignore')
    #ret = re.sub("([a-zA-Z])(uml|acute|grave|circ|tilde|cedil)", r"\1", ret)
    ret = re.sub("\W", " ", ret)
    ret = re.sub(" +", separator, ret)

    return ret

def time_to_str(time):
    return '%d:%02d' % (time / 60, time % 60)

def e14_pack(text, to_ascii=True):
    #return text # <- for debug
    z = bz2.compress(text)
    if to_ascii:
        z = base64.b64encode(z)
    return z

def e14_unpack(text, from_ascii=True):
    #return text # <- for debug
    z = text
    if from_ascii:
        z = base64.b64decode(z)
    return bz2.decompress(z)

class Items:
    """singleton kolekce existujicich Item objektu"""

    class __impl:
        """Implementace singletonu"""
        def __init__(self):
            self.items = dict()

        def byId(self, id):
            return self.items[id]
        
        def put(self, item):
            self.items[ item.id ] = item

        def as_list(self):
            return self.items.values()


    __instance = None

    def __init__(self):
        if Items.__instance is None:
            Items.__instance = Items.__impl()

        self.__dict__['_Items__instance'] = Items.__instance
    
    def __getattr__(self, attr):
        return getattr(self.__instance, attr)
    def __setattr__(self, attr, value):
        return setattr(self.__instance, attr, value)

class ItemDependency:
    def __init__(self, count, refid):
        self.count = count
        self.id = refid

    def item(self):
        return Items().byId(self.id)

    @staticmethod
    def from_string(depstring):
        check = re.compile("^(([0-9]+)\*)?([\w-]+)$")
        match = check.match(depstring)
        if match:
            count = 1
            iid = match.group(3)
            if not match.group(2) == None:
                count = int(match.group(2))
            return ItemDependency(count, iid)
        return None

class Item:
    def __init__(self):
        self.id = ''
        self.__name = ''
        self.time = 0
        self.price_direct = 0
        self.price_work = 0
        self.price_sell = 0
        self.depends = []

    def name(self):
        return self.__name

    def setname(self, newname):
        self.id = slugfy(newname, '_')
        self.__name = newname

    def time_final(self):
        t = self.time
        for d in self.depends:
            t += d.item().time_final() * d.count
        return t

    def price_final(self):
        p = self.price_direct + self.price_work
        for d in self.depends:
            p += d.item().price_final() * d.count
        return p

    def income(self):
        return self.price_sell - self.price_final()

    def gold_per_sec(self):
        if self.time == 0:
            return -1
        return self.income() / float(self.time_final())

    def time_from_str(self, time):
        if (type(time) is IntType) or time.isdigit():
            self.time = int(time)
        else:
            times = time.split(':')
            if len(times) == 2:
                self.time = int(times[0]) * 60
                self.time = self.time + int(times[1])

    def add_dependency(self, dep_item):
        self.depends.append(dep_item)

    def depends_from_str(self, deps_str):
        depids = deps_str.split(',')
        for depstr in depids:
            dep = ItemDependency.from_string(depstr)
            if not dep == None:
                self.add_dependency(dep)

    def depends_names(self):
        names = '['
        names += ','.join( [dep.item().name() for dep in self.depends] )
        names += ']'
        return names

    def depends_to_str(self):
        c = []
        for dep in self.depends:
            if dep.count == 1:
                c.append( dep.item().id )
            else:
                c.append( "%d*%s" % (dep.count, dep.item().id) )
        return ','.join(c)

    @staticmethod
    def item_from_dict(idict, encode=False):
        if 'name' not in idict:
            return None
        i = Item()
        name = idict.get('name')
        if encode:
            name = name.encode('utf-8')
        i.setname(name)
        i.time_from_str( idict.get('time','0:00') )
        i.price_direct = int( idict.get('price_direct', 0) )
        i.price_work = int( idict.get('price_work', 0) )
        i.price_sell = int( idict.get('price_sell', 0) )
        i.depends_from_str( idict.get('depends','') )
        return i


class ItemJsonEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Item):
            return {'__item__':True, 'name':obj.name(), 'time':obj.time,
                    'price_direct':obj.price_direct,
                    'price_work':obj.price_work, 'price_sell':obj.price_sell,
                    'depends':obj.depends_to_str()};
        return json.JSONEncoder.default(self, obj)

def json_to_item(dct):
    if '__item__' in dct:
        return Item.item_from_dict(dct, True)
    return dct

def input(name, value, options=''):
    return '<input type="text" name="%s" value="%s" %s />' % (
            name, value, options )

def input_label(label, name, value, options=''):
    return '<label>' + label + input(name,value,options) + '</label>'

def input_td(name, value, optionstd='', options=''):
    return '<td '+optionstd+'>' + input(name, value, options) + '</td>'

def input_td_short(name, value, optionstd='', options=''):
    options += ' size="6"'
    return input_td(name, value, optionstd, options)

def input_td_ro(name, value):
    return input_td_short(name, value, '', 'readonly="readonly" class="inputRO"')

def td_ro(value):
    return '<td class="inputRO">'+str(value)+'</td>'

def item_fields(item):
    fields = '<tr>'
    fields += td_ro(item.id)
    fields += input_td('item[%s][name]' % item.id, item.name())
    fields += input_td_short('item[%s][time]' % item.id, time_to_str(item.time))
    fields += input_td_short('item[%s][price_direct]' % item.id, item.price_direct)
    fields += input_td_short('item[%s][price_work]' % item.id, item.price_work)
    fields += input_td_short('item[%s][price_sell]' % item.id, item.price_sell)
    fields += input_td('item[%s][depends]' % item.id, item.depends_to_str())
    fields += td_ro(item.price_final())
    fields += td_ro(time_to_str(item.time_final()))
    fields += td_ro(item.income())
    gpsec = item.gold_per_sec()
    gpmin = 60*gpsec
    if gpsec == -1:
        gpsec = gpmin = 'n/a'
    else:
        gpsec = round(gpsec, 5)
        gpmin = round(gpmin, 3)
    fields += td_ro(gpsec)
    fields += td_ro(gpmin)
    fields += td_ro(item.depends_names())
    fields += '</tr>'
    return fields

def parse_cgi_vars(fieldstorage, arrayname):
    res = dict()
    key_pattern = re.compile("^" + arrayname + "\[([^\]]+)\]\[([^\]]+)\]$")
    for key in fieldstorage.keys():
        match = key_pattern.match(key)
        if match:
            p1 = match.group(1)
            p2 = match.group(2)
            if not res.has_key(p1):
                res[p1] = dict();
            res[p1][p2] = fieldstorage[key].value
    return res

form = cgi.FieldStorage()
new_item_count = int( form.getfirst('new_item_count', 3) )
itemsStorage = Items()

stored = form.getfirst('stored', '')
if stored:
    items = json.loads(e14_unpack(stored), object_hook=json_to_item, encoding='utf-8')
    for i in items:
        itemsStorage.put( i )
else:
    items_dict = parse_cgi_vars(form, 'item')
    for item_dict in items_dict.values():
        i = Item.item_from_dict(item_dict)
        if i is not None:
            itemsStorage.put( i )

store_string = json.dumps(itemsStorage.as_list(),
    cls=ItemJsonEncoder,
    ensure_ascii=True,
    encoding='utf-8')

if form.has_key('save_file'):
    filename = "e14_calc_save_" + \
        datetime.now().strftime("%Y-%m-%d_%H-%M") + \
        ".js.bz2"
    print('Content-Type: application/octet-stream')
    print('Content-Disposition: attachment; filename="'+filename+'"')
    print('Content-Encoding: binary')
    print('Content-Transfer-Encoding: binary')
    print
    sys.stdout.write(e14_pack(store_string, False))
    sys.exit()
else:
    store_string = e14_pack(store_string)

print('Content-Type: text/html;')
print

print('<html><head>')
print('<meta http-equiv="content-type" content="text/html;charset=utf-8" />')
print('<title>calc</title>')
print("""<style>
table, table tr, table td { border-collapse:collapse; border:1px solid gray;}
input { border: 0px solid gray; margin:0px;}
.inputRO, .inputRO input { background-color: #ccc; font-style:italic; }
body {cursor:default;}
input, textarea { cursor:text; }
a { cursor: hand; }
tr:hover td {
    background-color: #e0e0a0;
    }
</style>""");
print('</head>')
print("""<body>
        <h1>E14 Calculator</h1>""")
print('<form action="./" method="post"><div>')
print(input_label('Počet políček na nové položky: ', 'new_item_count', new_item_count))
print('<table id="items">')
print('''<tr>
    <th
        title="Název malými písmeny bez diakritiky a s _ místo mezer a spec znaků"
        >ID</th>
    <th title="Název produktu/suroviny.
    Je použit pro vygenerování ID (musí být unikátní).
    Položka s prázdným názvem bude odstraněna."
    >Název</th>
    <th title="Čas výroby jednoho kusu jedním pracovníkem (min:sec)">Čas</th>
    <th title="Přímá cena u suroviny">-$/sur</th>
    <th title="Cena práce">-$/prac</th>
    <th title="Prodejní cena">+$$$</th>
    <th title="Suroviny/polotovary použité při výrobě
    (jejich ID oddělené čárkou, volitelně s prefixem počet hvězdička)
    např. '1*hlina,2*blato' == 'hlina,2*blato' "
        >Deps</th>

    <th title="Celkové výdaje na jeden kus včetně závislostí (surovin)" ><em>&sum;$</em></th>
    <th title="Celkový čas na výrobu (včetně závislostí)"><em>&sum;Čas</em></th>
    <th title="Celkový zisk z jednoho kusu"><em>Zisk</em></th>
    <th title="Celkový zisk za vteřinu"><em>Zisk/sek</em></th>
    <th title="Celkový zisk za minutu"><em>Zisk/min</em></th>
    <th>DepNames</th>
    </tr>''')
for i in itemsStorage.as_list():
    print( item_fields(i) )
for new_idx in range(new_item_count):
    i = Item()
    i.id = '__new_%d' % new_idx
    print( item_fields(i) )

print('</table>')
print('<input type="submit" value="Recalculate" />')
print('</div></form>')

print('Save/load:<form action="./" id="saveForm" method="post"><div>'
        '<textarea name="stored" cols="70" rows="4">')
print(store_string)
print('</textarea><br /><input type="submit" value="load!!!" /></div></form>')
print('Bookmarkable save link: <a href="?stored=' +
        urllib.quote_plus(store_string) + '">E14Calc</a>')
print('<br />')
print('Download: <a href="?save_file=1&amp;stored=' +
        urllib.quote_plus(store_string) + '">save file</a> (json in bzip2)')



print('</body></html>')

