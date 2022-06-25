
//经纬度转成大地坐标x,y
function BLtoXY(lon, lat) {
    let m0, m2, m4, m6, m8;  //牛顿二项式展开级数系数
    let a0, a2, a4, a6, a8;          //延经线弧长公式系数
    let a;           //椭球长轴
    let e1_2;        //第一偏心率e1的平方
    let e2_2;        //第二偏心率e2的平方 
    let L0;          //中央子午线经度
    // 84坐标系参数
    a = 6378137;                        //椭球长半轴
    e1_2 = 0.0066943799013;         //第一偏心率平方
    e2_2 = 0.00673949674227;            //第二偏心率平方	
    m0 = a * (1 - e1_2);
    m2 = 3 * m0 * e1_2 / 2;
    m4 = 5 * m2 * e1_2 / 4;
    m6 = 7 * m4 * e1_2 / 6;
    m8 = 9 * m6 * e1_2 / 8;
    a0 = m0 + m2 / 2 + 3 * m4 / 8 + 5 * m6 / 16 + 35 * m8 / 128;
    a2 = m2 / 2 + m4 / 2 + 15 * m6 / 32 + 7 * m8 / 16;
    a4 = m4 / 8 + 3 * m6 / 16 + 7 * m8 / 32;
    a6 = m6 / 32 + m8 / 16;
    a8 = m8 / 128;
    let B = lat;
    let L = lon;
    let zone;
    if (L % 6 != 0)                //求带号
        zone = parseInt(L / 6) + 1;
    else
        zone = parseInt(L / 6);
    L0 = 6 * zone - 3;      //求中央经线
    let l;
    l = L - L0;                   //求经差
    l = l / 180 * Math.PI;               //经差用弧度表示
    B = B / 180 * Math.PI;               //弧度表示
    L = L / 180 * Math.PI;               //弧度表示
    let t, eta_2, N;         //t和η的平方
    t = Math.tan(B);
    eta_2 = e2_2 * Math.cos(B) * Math.cos(B);
    N = a / Math.sqrt(1 - e1_2 * Math.sin(B) * Math.sin(B));       //计算卯酉圈半径
    let k = a0 * B - a2 * Math.sin(2 * B) / 2 + a4 * Math.sin(4 * B) / 4 - a6 * Math.sin(6 * B) / 6 + a8 * Math.sin(8 * B) / 8;
    let cosbl_2, cosbl_3, cosbl_4, cosbl_5, cosbl_6;
    cosbl_2 = Math.cos(B) * Math.cos(B) * l * l;
    cosbl_3 = Math.cos(B) * Math.cos(B) * Math.cos(B) * l * l * l;
    cosbl_4 = Math.cos(B) * Math.cos(B) * Math.cos(B) * Math.cos(B) * l * l * l * l;
    cosbl_5 = Math.cos(B) * Math.cos(B) * Math.cos(B) * Math.cos(B) * Math.cos(B) * l * l * l * l * l;
    cosbl_6 = Math.cos(B) * Math.cos(B) * Math.cos(B) * Math.cos(B) * Math.cos(B) * Math.cos(B) * l * l * l * l * l * l;
    let m_X = 0, m_Y = 0;
    m_X = k + N * t * cosbl_2 / 2 + N * t * (5 - t * t + 9 * eta_2 + 4 * eta_2 * eta_2) * cosbl_4 / 24 + N * t * (61 - 58 * t * t + t * t * t * t) * cosbl_6 / 720;
    m_Y = N * l * Math.cos(B) + N * (1 - t * t + eta_2) * cosbl_3 / 6 + N * (5 - 18 * t * t + t * t * t * t + 14 * eta_2 - 58 * t * t * eta_2) * cosbl_5 / 120;
    m_Y += 500000;          //y坐标要加上500000m
    m_Y += zone * 1000000;	    //y坐标加上带号	
    return { x: m_X, y: m_Y };

}

//大地坐标x,y转成经纬度
function XYtoBL(x, y) {
    let a = 6378137;         //椭球长轴
    let e1_2;        //第一偏心率e1的平方
    let e2_2;        //第二偏心率e2的平方 
    e1_2 = 0.0066943799013;         //第一偏心率平方
    e2_2 = 0.00673949674227;            //第二偏心率平方	
    let zone;
    zone = parseInt(y / 1000000);  //求带号	
    let L0 = zone * 6 - 3;           //中央子午线经度
    y = y - zone * 1000000 - 500000;        //y的真实坐标
    let Bf;

    let b0, c0, e1_4, e1_6, e1_8, e1_10, e1_12, e1_14, e1_16;
    e1_4 = Math.pow(e1_2, 2);
    e1_6 = Math.pow(e1_2, 3);
    e1_8 = Math.pow(e1_2, 4);
    e1_10 = Math.pow(e1_2, 5);
    e1_12 = Math.pow(e1_2, 6);
    e1_14 = Math.pow(e1_2, 7);
    e1_16 = Math.pow(e1_2, 8);
    c0 = 1 + e1_2 / 4 + 7 * e1_4 / 64 + 15 * e1_6 / 256 + 579 * e1_8 / 16384 + 1515 * e1_10 / 65536 + 16837 * e1_12 / 1048576 + 48997 * e1_14 / 4194304 + 9467419 * e1_16 / 1073741824;
    c0 = a / c0;
    //	m=3380330.875;
    b0 = x / c0;
    let d1, d2, d3, d4, d5, d6, d7;
    d1 = 3 * e1_2 / 8 + 45 * e1_4 / 128 + 175 * e1_6 / 512 + 11025 * e1_8 / 32768 + 43659 * e1_10 / 131072 + 693693 * e1_12 / 2097152 + 10863435 * e1_14 / 33554432;
    d2 = -21 * e1_4 / 64 - 277 * e1_6 / 384 - 19413 * e1_8 / 16384 - 56331 * e1_10 / 32768 - 2436477 * e1_12 / 1048576 - 196473 * e1_14 / 65536;
    d3 = 151 * e1_6 / 384 + 5707 * e1_8 / 4096 + 53189 * e1_10 / 163840 + 4599609 * e1_12 / 655360 + 15842375 * e1_14 / 1048576;
    d4 = -1097 * e1_8 / 2048 - 1687 * e1_10 / 640 - 3650333 * e1_12 / 327680 - 114459079 * e1_14 / 27525120;
    d5 = 8011 * e1_10 / 1024 + 874457 * e1_12 / 98304 + 216344925 * e1_14 / 3670016;
    d6 = -682193 * e1_12 / 245760 - 46492223 * e1_14 / 1146880;
    d7 = 36941521 * e1_14 / 3440640;
    Bf = b0 + Math.sin(2 * b0) * (d1 + Math.sin(b0) * Math.sin(b0) * (d2 + Math.sin(b0)
        * Math.sin(b0) * (d3 + Math.sin(b0) * Math.sin(b0) * (d4 + Math.sin(b0) * Math.sin(b0)
            * (d5 + Math.sin(b0) * Math.sin(b0) * (d6 + d7 * Math.sin(b0) * Math.sin(b0)))))));
    let Mf, Nf, tf, etaf_2;
    Mf = (a * (1 - e1_2)) / Math.sqrt((1 - e1_2 * Math.sin(Bf) * Math.sin(Bf)) * (1 - e1_2 * Math.sin(Bf) * Math.sin(Bf)) * (1 - e1_2 * Math.sin(Bf) * Math.sin(Bf)));
    Nf = a / Math.sqrt(1 - e1_2 * Math.sin(Bf) * Math.sin(Bf));
    tf = Math.tan(Bf);
    etaf_2 = e2_2 * Math.cos(Bf) * Math.cos(Bf);
    let tf_2, tf_4, y_2, y_3, y_4, y_5, y_6, Nf_3, Nf_5;
    tf_2 = tf * tf;
    tf_4 = tf_2 * tf_2;
    y_2 = y * y;
    y_3 = y_2 * y;
    y_4 = y_3 * y;
    y_5 = y_4 * y;
    y_6 = y_5 * y;
    Nf_3 = Math.pow(Nf, 3);
    Nf_5 = Math.pow(Nf, 5);
    let B, L;
    B = Bf - tf * y_2 / (2 * Mf * Nf) + tf * (5 + 3 * tf_2 + etaf_2 - 9 * etaf_2 * tf_2) * y_4 / (24 * Mf * Nf_3) - tf * (61 + 90 * tf_2 + 45 * tf_4) * y_6 / (720 * Mf * Nf_5);
    L = y / (Nf * Math.cos(Bf)) - y_3 * (1 + 2 * tf_2 + etaf_2) / (6 * Nf_3 * Math.cos(Bf)) + (5 + 28 * tf_2 + 24 * tf_4 + 6 * etaf_2 + 8 * etaf_2 * tf_2) * y_5 / (120 * Nf_5 * Math.cos(Bf));
    let m_L = L0 + L * 180 / Math.PI;
    let m_B = B * 180 / Math.PI;
    return { x: m_L, y: m_B };
};
export { BLtoXY, XYtoBL };