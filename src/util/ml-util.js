

export const createModel = (windowSize,inputShape,outputShape) => {
  // Create a sequential model
  //const model = tf.sequential(); 
  
  // Add a single hidden layer
  //model.add(tf.layers.dense({inputShape: [inputShape], units: inputShape, useBias: true}));
  
  // Add an output layer
 // model.add(tf.layers.dense({units: inputShape, useBias: true}));

    const lstm = tf.layers.lstm({units: 1, returnState: true,batchShape:[1,windowSize,inputShape]});
    // Create an input with 10 time steps.
    const input1 = tf.input({shape: [windowSize, inputShape]});
    const outputs = lstm.apply(input1);
    const target = tf.input({shape: [windowSize, 1]});
    const model = tf.model({inputs: [input1,target], outputs: outputs});

  return model;
}

export const convertToTensor = (length,dim,data, isExpand) => {
  
  return tf.tidy(() => {
    const tensor = !isExpand ? tf.tensor2d(data, [length, dim]) : tf.tensor2d(data, [length, dim]).reshape([1,length,dim]);

    return tensor
  });  
}
export const compileModel = async(model) => {
    model.compile({
    optimizer: tf.train.adam(),
    loss: tf.losses.meanSquaredError,
    metrics: ['mse'],
  });
}
export const trainModel = async (carifyMe, model, inputTensor, labelTensor, batch_size, epochNum, dispatch) => {
  // Prepare the model for training.  
  
  const input1 = inputTensor
  const output = labelTensor.reshape([2880,1])
  const batchSize = batch_size;
  const epochs = epochNum;
  model.fit(input1, output,{
    batchSize,
    epochs,
    shuffle: false,
    
  }).then(function(value) {
    alert('finished')
    clarifyMe.testModel(model, inputTensor)});
  alert('test2')
}

export const testModel = (model, inputData) => { 
  
   const preds = model.predict(inputData);      
   return preds
}