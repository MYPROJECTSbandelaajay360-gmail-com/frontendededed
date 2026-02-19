import os

path = r'a:\BAKERY - Copy\the updated proj - Copy (2)\bakery_project\bakery\templates\bakery\base.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the specific problematic syntax
old_str = '{{ user.is_authenticated| yesno: "true,false" }}'
new_str = '{{ user.is_authenticated|yesno:"true,false" }}'
content = content.replace(old_str, new_str)

# Also fix the other potential ones (if any)
content = content.replace('| yesno:', '|yesno:')
content = content.replace(': "', ':"')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Successfully replaced.")
