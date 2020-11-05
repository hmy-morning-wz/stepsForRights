Component({
  mixins: [],
  data: {
    publicId: '',
    showLife: true
  },
  props: {
    publicId: ''
  },
  didMount() {
    let publicId = this.props.publicId    
    this.setData({
      publicId
    })
    console.log('didMount====', publicId)
  },
  didUpdate() { },
  didUnmount() { },
  methods: {
    closeLife() {
      this.setData({
        showLife: false
      })
    },
    onFollow() {
      console.log("onFollow")
    },
    onAppear(e) {
      //type "appear"
      console.log("onAppear", e)
    }

  },


});
