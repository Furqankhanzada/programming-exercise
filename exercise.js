/*
Thanks for your interest in our job opening. Before moving forward we'd like you to complete the
following programming exercise to ensure your technical skills meet our requirements. Feel free
to contact us if you have any questions with the task.

For this exercise you'll need to implement a Backbone view that displays the data associated with
a model and enables a user to edit the associated information. You can use twitter bootstrap for
styling and Mustache.js for templating.

Your view will need to support two states, one to present model information and another to support
the editing of model properties. View the attached images to see examples of what these states
should look like.

In general the information in the model will map directly to the information being presented in
the view. The sample size property is one exception. The model will save three different possible
sample sizes which correspond to three different methods of computing the sample size. The
currently selected method is stored as a string key in the sample_size_method property. Possible
values are 'presentations', 'participants', and 'responses', which should map to the sample sizes
stored in the 'num_presentations', 'num_participants', and 'num_responses' properties,
respectively.

The type attribute is another exception. You can use the following hashmap to translate type_id
values into actual types:
{
	1: Categorical,
	2: Rating Scale,
	3: Time,
	4: Open Ended
}
*/

// You may edit the model (add methods, etc.) if you wish, but it's not strictly necessary for this
// exercise.
var ExerciseModel = Backbone.Model.extend({});

// You may modify this view however you wish, overriding the initialize and render methods,
// adding methods and properties, etc.
var ExerciseView = Backbone.View.extend({
	tagName: 'div',
    presentationTemplate: $('#presentationTemplate').html(),
    editTemplate: $('#editTemplate').html(),
    initialize: function(){
        //pre-compiling the templates
        Mustache.parse(this.presentationTemplate);
        Mustache.parse(this.editTemplate);
    },
    events:{
        'click #edit' : 'loadEditTemplate',
        'click #save' : 'saveRecord',
        'click #cancel' : 'loadPresentationTemplate'
    },
	render: function() {
        this.loadPresentationTemplate();
		return this;
	},
    loadPresentationTemplate:function(){
        var model = this.model.toJSON();
        model.type_id = this.convertTypeId(model);
        model.sample_size_method = this.convertSampleSizeMethod(model);

        var template = Mustache.render(this.presentationTemplate, model);
        this.$el.html(template);
    },
    //converts type_id numeric values into corresponding String values
    convertTypeId:function(model){
        var type;

        switch(model.type_id + ''){
            case '1':
                type = 'Categorical';
                break;
            case '2':
                type = 'Rating Scale';
                break;
            case '3':
                type = 'Time';
                break;
            case '4':
                type = 'Open Ended';
                break;
        }

        return type;
    },
    //converts sample_size_method sting values into corresponding numeric values
    convertSampleSizeMethod:function(model){
        var sampleValue;

        switch(model.sample_size_method){
            case 'presentations':
                sampleValue = model.num_presentations;
                break;
            case 'participants':
                sampleValue = model.num_participants;
                break;
            case 'responses':
                sampleValue = model.num_responses;
                break;
        }

        return sampleValue;
    },
    loadEditTemplate:function(){
        this.$el.html( Mustache.render(this.editTemplate, this.model.toJSON()));
        this.$('#type_id').val( this.model.get('type_id') );
        this.$('[name="sample_size_method"]').parent('label').removeClass('active');
        this.$('[name="sample_size_method"][value="'+ this.model.get('sample_size_method') +'"]')
            .parent('label')
            .addClass('active');
    },
    saveRecord: function() {
        var values = {
            name               : this.$('#name').val(),
            prompt             : this.$('#prompt').val(),
            source             : 'uz',
            type_id            : this.$('#type_id').val(),
            sample_size_method : this.$('[name="sample_size_method"]:checked').val()
        };

        this.model.set(values);
        this.loadPresentationTemplate();

    }
});

/***** Do not modify code below this line *****/
$(function() {
	var testModel = new ExerciseModel({
		name               : 'Example question',
		prompt             : 'How would you categorize this question?',
		source             : 'uz',
		type_id            : 1,
		num_responses      : 36,
		num_participants   : 98,
		num_presentations  : 36,
		sample_size_method : 'presentations'
	});
	var testView = new ExerciseView({model: testModel});
	$('#container').html(testView.render().el);
});