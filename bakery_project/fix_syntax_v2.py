import re

path = r'a:\BAKERY - Copy\the updated proj - Copy (2)\bakery_project\bakery\templates\bakery\base.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

def fix_template_tags(match):
    tag_content = match.group(1)
    # Remove spaces around | and :
    tag_content = re.sub(r'\s*\|\s*', '|', tag_content)
    tag_content = re.sub(r'\s*:\s*', ':', tag_content)
    return '{{ ' + tag_content.strip() + ' }}'

# Match {{ ... }}
new_content = re.sub(r'\{\{(.*?)\}\}', fix_template_tags, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully cleaned template tags.")
