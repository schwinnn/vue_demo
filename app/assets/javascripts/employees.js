Vue.http.interceptors.push({
  request: function (request) {
    console.log($('[name="csrf-token"]').attr('content'));
    Vue.http.headers.common['X-CSRF-Token'] = $('[name="csrf-token"]').attr('content');
    return request;
  },
  response: function (response) {
    return response;
  }
});

var employees = new Vue({
  el: '#employees',
  data: {
    employees: [],
    employee: {
      name: '',
      email: '',
      manager: false
    },
    errors: {}
  },
  ready: function(){
    var that;
    that = this;
    this.$http.get('/employees.json').then(
      function(response){
        console.log(response);
        that.employees = response.data;
      }
    )
  },
  methods: {
    hireEmployee: function () {
      var that = this;
      this.$http.post('/employees.json', { employee: this.employee }).then(
        function(response){
          that.errors = {};
          that.employee = {};
          that.employees.push(response.data);
        },
        function(response){
          that.errors = response.data.errors
        }
      )
    }
  }
});

Vue.component('employee-row', {
  template: '#employee-row',
  props: {
    employee: Object
  },
  data: function(){
    return {
      editMode: false,
      errors: {}
    }
  },
  methods: {
    toggleManagerStatus: function(){
      this.employee.manager = !this.employee.manager
      this.updateEmployee()
    },
    updateEmployee: function(){
      var that = this;
      this.$http.put('/employees/' + that.employee.id + '.json', {employee: that.employee}).then(
        function(response){
          that.errors = {}
          that.employee = response.data
          that.editMode = false
        },
        function(response){
          that.errors = response.data
        }
      )
    },
    fireEmployee: function () {
      var that = this;
      this.$http.delete('/employees/' + that.employee.id + '.json').then(
        function(response){
          that.$remove()
        }
      )
    }
  }
});
