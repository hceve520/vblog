let currentLang='en';
let messages={}

//EtLang会将扩展的国际化包的key自动加上appCode_前缀，不便使用，此处直接将自定义国际化包追加到主语言包中
//此处需要注意的是：如果出现重名的key将不进行覆盖，只进行增量追加
var i18nProj = require('./event-disposal')

for (let locale in i18nProj) {
    if(!messages.hasOwnProperty(locale)) {
        continue;
    }

    for (let key in i18nProj[locale]) {
        // 主语言包已经存在改key
        if (messages[locale].hasOwnProperty(key)) {
            continue;
        }

        if (typeof(i18nProj[locale][key]) === 'string' || typeof(i18nProj[locale][key]) === 'number') {
            messages[locale][key] = i18nProj[locale][key];
        } else {
            messages[locale][key] = { ...i18nProj[currentLang][key] };
        }
    }
}

export {
  messages,
  currentLang
}

