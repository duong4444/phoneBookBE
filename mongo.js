const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];
const inputName = process.argv[3];
const inputNumber = process.argv[4];

const url = `mongodb+srv://duongkc4444:${password}@cluster0.dd0jp.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);

mongoose.connect(url)
  .then(() => {
    const pBSchema = new mongoose.Schema({
      name: String,
      number: String
    });

    const phoneBook = mongoose.model('person', pBSchema);

    if (inputName && inputNumber) {
      const phonebook = new phoneBook({
        name: inputName,
        number: inputNumber
      });

      return phonebook.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`);
      });
    } else {
      return phoneBook.find({}).then(rs => {
        console.log('phonebook:');
        rs.forEach(pb => {
          console.log(pb.name, pb.number);
        });
      });
    }
  })
  .catch(err => {
    console.error(err);
  })
  .finally(() => {
    mongoose.connection.close();
  });
