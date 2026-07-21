# Codex Dream Skin

缁?Codex 妗岄潰鐗堟崲涓婂姩鎬佽棰戝绾镐富棰橈紝鏀寔纾ㄧ爞姣涚幓鐠冩晥鏋滃拰浜屾鍏冮鏍笺€?
![Preview](preview.gif)

## 鍔熻兘鐗规€?
- **鍔ㄦ€佽棰戝绾?* - 鏀寔 MP4 瑙嗛浣滀负鑳屾櫙
- **纾ㄧ爞姣涚幓鐠冩晥鏋?* - 鍗婇€忔槑鐣岄潰锛岄殣绾﹂€忓嚭鑳屾櫙
- **閲戣壊涓婚閰嶈壊** - 钂欏痉鍩庡鏅鏍硷紝娓╂殩鏌斿拰
- **鑷姩娉ㄥ叆** - 涓€閿惎鍔紝鑷姩搴旂敤涓婚
- **鏃犻渶淇敼婧愮爜** - 閫氳繃 CDP 鍗忚娉ㄥ叆锛屼笉鐮村潖鍘熸枃浠?
## 绯荤粺瑕佹眰

- Windows 10/11
- [Node.js](https://nodejs.org/) 16.0 鎴栨洿楂樼増鏈?- Codex 妗岄潰鐗堝凡瀹夎

## 蹇€熷畨瑁?
### 鏂规硶涓€锛氫竴閿畨瑁咃紙鎺ㄨ崘锛?
1. 涓嬭浇鏈粨搴撳埌鏈湴
2. 鍙屽嚮杩愯 `install.bat`
3. 鎸夋彁绀哄畬鎴愬畨瑁?
### 鏂规硶浜岋細鎵嬪姩瀹夎

1. 涓嬭浇鏈粨搴撳埌鏈湴锛屼緥濡傛斁鍒?`E:\codex\Codex-Dream-Skin`
2. 纭繚 Node.js 宸插畨瑁咃紙鍦ㄥ懡浠よ杈撳叆 `node --version` 妫€鏌ワ級
3. 杩愯浠ヤ笅鍛戒护锛?   ```powershell
   powershell -ExecutionPolicy Bypass -File "E:\codex\Codex-Dream-Skin\launch-codex-dream.ps1"
   ```

## 浣跨敤鏂规硶

### 鍚姩甯︾毊鑲ょ殑 Codex

**鏂瑰紡涓€锛氬弻鍑诲惎鍔?*
- 鍙屽嚮 `E:\codex\Codex-Dream-Skin\install.bat` 鍒涘缓鐨?`launch-codex.bat`锛堝湪 Codex 瀹夎鐩綍锛?
**鏂瑰紡浜岋細鐩存帴杩愯**
```powershell
powershell -ExecutionPolicy Bypass -File "E:\codex\Codex-Dream-Skin\launch-codex-dream.ps1"
```

### 棣栨浣跨敤

1. 鍏抽棴姝ｅ湪杩愯鐨?Codex
2. 杩愯涓婅堪鍚姩鍛戒护
3. Codex 浼氳嚜鍔ㄥ紑鍚皟璇曠鍙ｏ紙30123锛?4. 涓婚浼氳嚜鍔ㄦ敞鍏ワ紝绛夊緟鍑犵鍗冲彲鐪嬪埌鏁堟灉

### 鍒囨崲涓婚

缂栬緫 `themes/mondstadt-dusk/theme.json` 鍙嚜瀹氫箟锛?- `accent` - 涓婚寮鸿皟鑹诧紙閲戣壊锛?E8B84B锛?- `surface` - 鐣岄潰鑳屾櫙鑹?- `ink` - 鏂囧瓧棰滆壊
- `image` - 鑳屾櫙瑙嗛鏂囦欢鍚?
## 椤圭洰缁撴瀯

```
Codex-Dream-Skin/
鈹溾攢鈹€ install.bat                    # 涓€閿畨瑁呰剼鏈?鈹溾攢鈹€ launch-codex-dream.ps1        # 涓诲惎鍔ㄨ剼鏈?鈹溾攢鈹€ engine/
鈹?  鈹溾攢鈹€ inject-video-theme.cjs    # CDP 娉ㄥ叆鍣?鈹?  鈹斺攢鈹€ dream-skin.css            # 涓婚鏍峰紡琛?鈹溾攢鈹€ themes/
鈹?  鈹斺攢鈹€ mondstadt-dusk/          # 钂欏痉鍩庡鏅富棰?鈹?      鈹溾攢鈹€ theme.json            # 涓婚閰嶇疆
鈹?      鈹斺攢鈹€ mondstadt-dusk.mp4   # 鑳屾櫙瑙嗛
鈹斺攢鈹€ README.md
```

## 鑷畾涔夎棰戝绾?
1. 鍑嗗涓€涓?MP4 瑙嗛鏂囦欢锛堝缓璁?1080p锛?5MB 浠ュ唴锛?2. 澶嶅埗鍒?`themes/mondstadt-dusk/` 鐩綍
3. 淇敼 `theme.json` 涓殑 `image` 瀛楁涓轰綘鐨勬枃浠跺悕
4. 閲嶆柊杩愯鍚姩鑴氭湰

## 宸ヤ綔鍘熺悊

鏈」鐩娇鐢?Chrome DevTools Protocol (CDP) 娉ㄥ叆涓婚锛?
1. 鍚姩 Codex 鏃跺紑鍚繙绋嬭皟璇曠鍙ｏ紙30123锛?2. 閫氳繃 WebSocket 杩炴帴鍒?Codex 鐨勬覆鏌撹繘绋?3. 娉ㄥ叆 CSS 鏍峰紡琛ㄥ拰瑙嗛鑳屾櫙
4. 璁剧疆姣涚幓鐠冩晥鏋滃拰閫忔槑鑳屾櫙

**浼樼偣锛?*
- 涓嶄慨鏀?Codex 鍘熷鏂囦欢
- 鏇存柊 Codex 鍚庝粛鍙娇鐢?- 闅忔椂鍙仮澶嶅師鐢熺晫闈?
**娉ㄦ剰锛?*
- 姣忔閲嶅惎 Codex 閮介渶瑕侀噸鏂版敞鍏?- 寤鸿浣跨敤鍚姩鑴氭湰鑰岄潪鐩存帴鎵撳紑 Codex

## 甯歌闂

### Q: 鍚姩鍚庢病鏈夌湅鍒颁富棰樻晥鏋滐紵
A: 纭繚锛?- 宸插叧闂墍鏈?Codex 绐楀彛
- 浣跨敤鍚姩鑴氭湰鑰岄潪鐩存帴鎵撳紑 Codex
- Node.js 宸叉纭畨瑁?
### Q: 瑙嗛鎾斁鍗￠】锛?A: 灏濊瘯锛?- 浣跨敤鏇村皬鐨勮棰戞枃浠讹紙< 10MB锛?- 闄嶄綆瑙嗛鍒嗚鲸鐜囷紙720p锛?- 浣跨敤鏇寸煭鐨勮棰戝惊鐜?
### Q: 濡備綍鎭㈠鍘熺敓鐣岄潰锛?A: 鐩存帴閲嶅惎 Codex锛堜笉鐢ㄥ惎鍔ㄨ剼鏈級鍗冲彲鎭㈠銆?
### Q: 鏇存柊 Codex 鍚庝富棰樺け鏁堬紵
A: 閲嶆柊杩愯鍚姩鑴氭湰鍗冲彲锛屾棤闇€閲嶆柊瀹夎銆?
## 鑷畾涔夊紑鍙?
### 淇敼 CSS 鏍峰紡

缂栬緫 `engine/dream-skin.css`锛屼娇鐢ㄦ祻瑙堝櫒寮€鍙戣€呭伐鍏锋煡鐪嬪厓绱犵被鍚嶏細
- `html.codex-dream-skin` - 鏍归€夋嫨鍣?- `aside.app-shell-left-panel` - 宸︿晶杈规爮
- `main.main-surface` - 涓诲唴瀹瑰尯
- `.composer-surface-chrome` - 杈撳叆妗嗗尯鍩?
### 鍒涘缓鏂颁富棰?
1. 澶嶅埗 `themes/mondstadt-dusk/` 鐩綍
2. 鏇挎崲瑙嗛鏂囦欢
3. 淇敼 `theme.json` 閰嶇疆
4. 鏇存柊鍚姩鑴氭湰涓殑涓婚璺緞

## 璁稿彲璇?
MIT License

## 鑷磋阿

- 鍘熺悊鍙傝€冿細[Codex-Dream-Skin](https://github.com/Fei-Away/Codex-Dream-Skin)
- 瑙嗛鏉ユ簮锛氬師绁炶挋寰峰煄澶滄櫙

---

**鎻愮ず锛?* 濡傛灉浣犻亣鍒伴棶棰橈紝鍙互澶嶅埗涓嬮潰鐨勬彁绀鸿瘝缁?AI锛岃瀹冨府浣犺В鍐筹細

```
鎴戞兂缁?Codex 妗岄潰鐗堟崲鐨偆锛屼娇鐢?Codex Dream Skin 椤圭洰銆?椤圭洰鍦板潃锛歨ttps://github.com/浣犵殑鐢ㄦ埛鍚?Codex-Dream-Skin

璇峰府鎴戯細
1. 妫€鏌?Node.js 鏄惁宸插畨瑁?2. 鍏嬮殕浠撳簱鍒?E:\codex\Codex-Dream-Skin
3. 杩愯瀹夎鑴氭湰
4. 鍚姩甯︿富棰樼殑 Codex

濡傛灉閬囧埌闂锛岃妫€鏌ワ細
- Codex 瀹夎璺緞鏄惁姝ｇ‘
- 璋冭瘯绔彛 30123 鏄惁琚崰鐢?- 瑙嗛鏂囦欢鏄惁瀹屾暣
```

