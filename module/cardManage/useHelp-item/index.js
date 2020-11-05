import { connect } from 'herculex';

Component(connect({
  mapStateToProps: ['helpData']
})({
  props: {
    onTap: () => {
    }
  },
  data: {},
  methods: {
    onTap(e) {
      this.props.onTap(e);
    }
  }
}));
