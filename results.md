User Testing Tool Results API
==================================
This document contains information on the JSON results.

<br/>1. Sample JSON
----------------------------------
```
{
  "error": 0,
  "description": "https://github.com/AccessibilityNL/User-Testing-Tool/blob/master/results.md",
  "data": [
    {
      "ip": "XXX.XXX.XXX.XXX",
      "user_agent": "Mozilla\/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/61.0.3163.100 Safari\/537.36",
      "browser": "Chrome",
      "browser_version": "61.0.3163.100",
      "platform": "Windows",
      "platform_version": "6.3",
      "device": "",
      "device_type": "desktop",
      "created_at": "2017-10-12 15:31:25",
      "questions_asked": "17",
      "questions_answered": "17",
      "webpage": {
        "id": 993,
        "scheme": "http",
        "host": "nda.ie",
        "path": "\/",
        "query": "",
        "fragment": "",
        "url": "http:\/\/domain.com\/",
        "description": null,
        "is_enabled": true,
        "created_at": "2017-10-12 15:31:25",
        "updated_at": "2017-10-12 15:31:25"
      },
      "results": [
        {
          "module": "title",
          "type": "all",
          "status": "pass",
          "value": "\n\tTEXT_TITLE\n",
          "info": "",
          "created_at": "2017-10-12 15:31:30",
          "info_id": "utt::title:all"
        }
      ]
    }
  ]
}
```

<br/>2. Description
----------------------------------
The JSON data consists of every test that has been run in the UTT tool. 

Description of keys and values:

1.  **data**: This property contains an array of all the individual test session as objects. Every test session has fields about the platform, device, browser, ip, date created and how many questions that have been asked and answered. Other specific fields are: 
    - **webpage**: this object describes information about the visited url:
        - **scheme**: http or https
        - **host**: the domain name
        - **path**: the path after the domain name
        - **query**: query parameters, values after the ? questionmark
        - **fragment**: values after the # hash
        - **url**: the full url with all the parts that construct the url
        - **created_at**: first time this webpage has been tested
    - **results**: this is an array with all the test results of the webpage that has been tested in this test session
       - **module**: values are based on the available modules that are also visible/active in the tool: title, heading, poll, image.
       - **type**: The type can be either "all" (the module generated this result by testing values)  or "feedback" (the user answered a question, resulting in this result).
       - **status**: The status can be "yes", "no", "pass", "fail" or "incomplete" (incomplete means the user did not answer the question).
       - **value**: The value for the module "title" is the page title. For the module "heading" the value is the type of heading (h1 to h6). For the module "poll" the value is user entered text to a question. For the module "image" the value is the full url to the image.
       - **info**: For the module "heading" the value is the text of the heading. For the module "poll" it is the text of the question that the user answered. For the module "image" it is the alternative text of the image.
       - **info_id**: The unique question ID.
       - **created_at**: The date-time the result was generated.