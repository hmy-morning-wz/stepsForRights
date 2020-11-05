import { connect } from 'herculex';

Component(connect({
  mapStateToProps: []
})({
  props: {
    onBtnItem: () => {
    }
  },
  data: {},
  methods: {
    onBtnItem(e) {
      this.props.onBtnItem(e);
    }
  }
}));
