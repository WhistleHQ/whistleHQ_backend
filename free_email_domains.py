import requests
import json
import os
# Simple Python script for retrieving a list of free email domains
SOURCE_URL = 'https://gist.githubusercontent.com/tbrianjones/5992856/raw/87f527af7bdd21997722fa65143a9af7bee92583/free_email_provider_domains.txt'


def get_domains():
    resp = requests.get(SOURCE_URL)
    domains_list = {dom: dom for dom in resp.text.split('\n')}
    # I forgot to do this when I was testing with mailinator smh...
    domains_list['mailinator.com'] = 'mailinator.com'
    return domains_list


if __name__ == '__main__':
    cwd = os.getcwd()
    BLACKLIST_JSON_FILE = 'free_email_domains.json'
    try:
        with open(os.path.join(cwd, BLACKLIST_JSON_FILE), 'r') as json_cache:
            BLACKLIST = json.loads(json_cache.read())
        print('CHECK : free_email_domains.json > FOUND')
    except FileNotFoundError:
        print('FETCH : free_email_provider_domains > SOURCE_URL')
        BLACKLIST = get_domains()

        with open(os.path.join(cwd, BLACKLIST_JSON_FILE), 'w') as json_output:
            json_output.write(json.dumps(BLACKLIST))
        print('SAVE : free_email_domains.json > DONE')
