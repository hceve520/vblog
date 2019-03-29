# 基于开源hc-bee的脚手架，内置基于leaflet封装的地图组件
## 环境前置条件（包括git、vscode配置、honyecomb-cli等），参考honeycomb官网，window用户操作：https://www.yuque.com/honeycomb/honeycomb/dev-win

## 安装

```
make install
```

## 启动

```
honeycomb start
```

## 打包

```
honeycomb package
```

## 注意：1）当某个场景需作为小程序提供给云推或他人时，目录结构改为（其余业务场景功能，可依据各自业务自行划分，也可直接用此结构）

    ├── pages
    │   ├── demoPage              //小程序独立文件夹（必须，名称可变）
    │   │   ├── components          //小程序包含的组件(必须)
    │   │   │   └── around_info         //小程序相关主组件（必须）
    │   │   │   └── cover         //小程序封面（可选，若无，用默认封面，待实现）
    │   │   ├── style               //包含less及图片、js等静态资源
    │   │   │   └── index.less  //（可选）
    │   │   │   └── img     //（可选）
    │   │   ├── index.jsx               //小程序主入口
 ## 2）在assets/resource/config_route.json里面的appList里配置相关小程序信息即可，动态加载组件

