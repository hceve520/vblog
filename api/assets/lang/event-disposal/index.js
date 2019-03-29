// 项目化国际化
var i18nProj = {};
var defaultLocale = 'zh-cn';

i18nProj['zh-cn'] = require('./zh-cn.js');

i18nProj['en-us'] = require('./en-us.js');

i18nProj['pt-pt'] = require('./pt-pt.js');


for (var locale in i18nProj) {
  if(!i18nProj.hasOwnProperty(locale)){
    continue;
  }
  if(locale == defaultLocale){
    continue;
  }
  for(var key in i18nProj[defaultLocale]){
    if(!i18nProj[defaultLocale].hasOwnProperty(key)){
      continue;
    }
    if(!i18nProj[locale].hasOwnProperty(key)){
      i18nProj[locale][key] = i18nProj[defaultLocale][key];
    }
  }
}

//把其它信息也加上去
// i18nProj.appName = 'event-perceiving';
// i18nProj.groupName = 'et-brain';
// i18nProj.defaultLocale = defaultLocale;

module.exports = i18nProj;

