# 3D 立體成型掃描機

![Static Badge](https://img.shields.io/badge/node-20.15.0-green?logo=nodedotjs)
![Static Badge](https://img.shields.io/badge/nextjs-14.2.5-green?logo=nextdotjs)
![Static Badge](https://img.shields.io/badge/bootstrap-5.3.3-green?logo=bootstrap)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/MakerbaseMoon/3d_scanner_nextjs/nextjs.yml?logo=github&label=Github%20Page)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/MakerbaseMoon/3d_scanner_nextjs/release.yml?logo=github&label=Release)

This is a 3D scanner developed using Next.js. Through the scanner, the three-dimensional image of the object can be converted into a 3D model, and it can be controlled through the web interface. The ESP32 Code can be referred to **[3D_Scanner_ESP](https://github.com/MakerbaseMoon/3d_scanner_esp)** project.

![img](https://github.com/MakerbaseMoon/3d_scanner_nextjs/releases/download/v0.0.0/image.png)



## Installation package
 - **axios**
 - **bootstrap**
 - **three**
 - **remark**
 - **remark-html**
 - **remark-parse**
 - **unified**
 - **vfile**

## Home page
### mode
 - **Auto**
 - **Scan**

### Scan Mode 
- **Switch Mode**  
- **Change Angle**
- **status Button**
- **3D Model spin**

### Auto Mode 
- **Switch Mode** 
- **Change Angle**
- **Download Image**
- **Download CSV**
- **3D Model spin**

## Setting  Page
### Z Axis Settings
- **Z軸最大值 (Z Axis Max Value)**
- **Z軸每次上升微步 (Z Axis One Time Step)**
- **Z軸速度 (Z Axis Speed)**
- **Z軸初始矯正值 (Z Axis Start Step)**

### X Y Axis Settings
- **X Y軸1圈微步 (X Y Axis Max Value)**
- **X Y軸每次上升微步 (X Y Axis One Time Step)**
- **X Y軸速度 (X Y Axis Speed)**
- **X Y軸掃描次數 (X Y Axis Check Times)**

### Laser Settings
- **雷射中心點 (Laser Center Point)**
- **雷射 Timeing Budget (Laser Timing Budget)**

### Z Axis Control
- **Z軸步數 (Z Axis Steps)**
- **Z軸 往上 (Z Axis Up)**
- **Z軸 歸位 (Z Axis Home)**
- **Z軸 往下 (Z Axis Down)**

### Current Status
- **目前Z軸位置 (Current Z Axis Position)**
- **雷射測距 (Laser Distance Measurement)**

## WiFi Page
- **STA SSID**
- **STA Password**
- **AP SSID**
- **AP Password**
- **ESP32 Name**

## OTA Page
### GitHub Repository Configuration
- **Username**
- **Repo**

### Actions
- **Update Status** 
- **Update Status and Upload**

### Release Selection
- **Release Dropdown**

### Release Details
- **Release Name**
- **Author**
- **Release Date**
- **Version**
- **Branch**

### Release Notes
- **Release Notes**

### Assets
- **Asset Name**
- **Firmware Flash Button**
