import { UserDetails } from '../data/user-details';
import { faker } from '@faker-js/faker';



// this method will generate a random username
// tried using timestamp but user creation didnt work
// so using a random number instead
// this is not a unique username generator, but it will work for the test cases
export function generateFabricUsername() {
    const username = `fabricNewUser${Math.floor(Math.random() * 1000)}`;
    return username;
}

export function createUserDetails() {
    const userDetails = new UserDetails();
    
    userDetails.firstName = faker.person.firstName();
    userDetails.lastName = faker.person.lastName();
    userDetails.street = faker.location.streetAddress();
    userDetails.city = faker.location.city();
    userDetails.state = faker.location.state();
    userDetails.zipCode = faker.location.zipCode();
    userDetails.phoneNumber = faker.phone.number({ style: 'international' });
    userDetails.ssn = faker.number.int({ min: 100000000, max: 999999999 }).toString();
    userDetails.username = generateFabricUsername();
    userDetails.password = faker.internet.password({ length: 12, memorable: true });
    userDetails.repeatedPassword = userDetails.password;

    return userDetails;
}