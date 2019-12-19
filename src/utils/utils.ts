import { parse } from 'qs';
import moment from 'moment';

/**
 * 获取路由参数
 */
export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

/**
 * 日期格式转换
 */
export function formatDate(date: string | number, format: string = 'YYYY-MM-DD HH:mm:ss') {
  return moment(date).format(format);
}

/**
 * 替换11 位手机中间 4 位为星号
 */
export function phoneNumberStar(str: string) {
  if (str === undefined) return '';
  return str.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}


/**
 * 转换搜索时间为时间戳
 */
export function formatDateTimeStamp(date: string | number, type = 'start') {
  if (date === undefined || date === '') return;
  if (type === 'start') {
    return moment(moment(date).format('YYYY-MM-DD 00:00:00')).valueOf();
  }
  if (type === 'end') {
    return moment(moment(date).format('YYYY-MM-DD 23:59:59')).valueOf();
  }
  return '';
}

/**
 * 删除对象里面的undefined 和 ''
 */
export function deleteNullValue(data: object) {
  for (let i in data) {
    if (data[i] === undefined || data[i] === '') {
      delete data[i];
    }
  }
  return data;
}

/**
 * 判断所有loading是否都为 true
 */
export function mergeLoading(...args: any[]) {
  let loadingStatus = false;
  args.forEach((status: boolean) => {
    if (status) {
      loadingStatus = true;
    }
  });
  return loadingStatus;
}

/**
 * 获取某个枚举
 */

export function getEnumValueList(name: string): any {
  let data = localStorage.getItem('allEnum');
  if (data !== null) {
    data = JSON.parse(data);
    // @ts-ignore
    return data[name] ? data[name] : [];
  }
  return [];
}

export function generateList(data: any) {
  const dataList: any[] | never[] = [];
  if (!data) return [];
  const recursive = (data: any) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      if (node.children) {
        recursive(node.children);
      }
      // @ts-ignore
      dataList.push(node);
      delete node.children;
    }
  };
  recursive(data);
  return dataList;
};

export function formatFormData(formItem: any, values: any) {
  if (formItem && values) {
    formItem.forEach((item: any) => {
      if (item.type === 'datePicker') {
        values[item.id] = values[item.id].format('YYYY-MM-DD HH:mm:ss');
      } else if (item.type === 'rangePicker') {
        values[item.id][0] = values[item.id][0].format('YYYY-MM-DD HH:mm:ss');
        values[item.id][1] = values[item.id][1].format('YYYY-MM-DD HH:mm:ss');
      }
    });
  }
  return values;
}


export function getQueryVariable(name: string) {
  let href = window.location.href;
  let query = href.substring(href.indexOf('?') + 1);
  let vars = query.split('&');
  let obj = {};
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split('=');
    obj[pair[0]] = pair[1];
  }
  if (name) return obj[name] || null;
  return obj;
}

