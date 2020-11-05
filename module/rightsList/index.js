import { connect } from 'herculex';

Component(connect({
  mapStateToProps: []
})({
  props: {
  },
  data: {},
  methods: {
    onBtnSubTitle(e) {
      console.log('----- 你点击了全部 -----', e);
    }
  }
}));
