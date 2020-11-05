let methods = {
  // "test":(value)=>{
  //   my.alert({
  //     title: value
  //   });
  //  },
  date: value => {
    return (
      value.slice(0, 4) +
      '年' +
      value.slice(4, 6) +
      '月' +
      value.slice(6) +
      '日'
    );
  },
  time: value => {
    return value.slice(0, 2) + ':' + value.slice(2, 4);
  },
  nohourdiff: (start, end) => {
    return ((end - start) % 100) + '分钟';
  }
};
export default methods;
