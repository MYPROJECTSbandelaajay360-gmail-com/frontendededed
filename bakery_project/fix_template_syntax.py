import os

path = r'a:\BAKERY - Copy\the updated proj - Copy (2)\bakery_project\bakery\templates\bakery\base.html'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace with a more robust non-filter version
old_line_yesno = 'const isAuthenticated = {{ user.is_authenticated|yesno:"true,false" }};'
new_line_yesno = 'const isAuthenticated = {% if user.is_authenticated %}true{% else %}false{% endif %};'

content = content.replace(old_line_yesno, new_line_yesno)

# Also handle the default filters for user_id
old_user_id = 'user_id: isAuthenticated ? {{ user.id|default:"null" }} : null'
new_user_id = 'user_id: isAuthenticated ? "{{ user.id }}" : null'

content = content.replace(old_user_id, new_user_id)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Template syntax successfully replaced with safer version.")
