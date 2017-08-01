export default function handleText(e) {
  let t = ''

  // 如果传入的是元素，则继续遍历其子元素
  // 否则假定它是一个数组
  e = e.childNodes || e

  // 遍历所有子节点
  for (let j = 0; j < e.length; j += 1) {
    // 如果不是元素，追加其文本值
    // 否则，递归遍历所有元素的子节点
    t += e[j].nodeType !== 1 ? e[j].nodeValue : this.handleText(e[j].childNodes)
  }
  // 返回区配的文本
  return t
}
