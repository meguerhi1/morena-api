module.exports = (req, res) => {
  // السماح بالطلبات من أي موقع
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  
  // قائمة المفاتيح الصالحة
  const validKeys = ["FATAH2029", "123456", "ABC999", "مورينا2024"];
  const expiredKeys = ["FATAH2013", "OLDKEY123"];
  
  // روابط الحلقات
  const episodeLinks = {
    "1": "https://ia800109.us.archive.org/23/items/morena-clara-1/morena%20clara%201.ia.mp4?cnt=0",
    "2": "https://ia600608.us.archive.org/3/items/mclara2/mclara2.mp4?cnt=0",
    "3": "https://ia803203.us.archive.org/3/items/mclara3/mclara3.mp4",
    "4": "https://ia600704.us.archive.org/5/items/mclara4/mclara4.mp4",
    "5": "https://ia800507.us.archive.org/5/items/mclarae5/mclarae5.mp4",
    "6": "https://ia601600.us.archive.org/32/items/mclarae6/mclarae6.mp4"
  };
  
  let action = req.query.action;
  let key = req.query.key;
  let episodeId = req.query.episodeId;
  
  if (action === "verify") {
    if (validKeys.includes(key)) {
      return res.json({ success: true, status: "active" });
    } 
    else if (expiredKeys.includes(key)) {
      return res.json({ success: false, status: "expired", message: "⚠️ انتهت صلاحية اشتراكك" });
    }
    else {
      return res.json({ success: false, status: "invalid" });
    }
  }
  
  else if (action === "getEpisode") {
    const episodeNum = parseInt(episodeId);
    
    if ([1, 2, 3, 4].includes(episodeNum)) {
      const url = episodeLinks[episodeId];
      if (url) return res.json({ success: true, url: url });
    }
    else if ([5, 6].includes(episodeNum)) {
      if (validKeys.includes(key)) {
        const url = episodeLinks[episodeId];
        if (url) return res.json({ success: true, url: url });
      } else {
        return res.json({ success: false, locked: true, message: "🔒 هذه الحلقة للمشتركين فقط" });
      }
    }
    else {
      return res.json({ success: false, message: "حلقة غير موجودة" });
    }
  }
  
  else {
    return res.json({ success: false, message: "أمر غير معروف" });
  }
};