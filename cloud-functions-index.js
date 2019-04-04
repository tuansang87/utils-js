const functions = require("firebase-functions");
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');
// const { Storage } = require('@google-cloud/storage');
// const storage = new Storage({
//     projectId: 'test-cloud-functions-8b68c',
// });


var serviceAccount = require('./test-cloud-functions-8b68c-firebase-adminsdk-oer4g-b33ccdb089.json');
admin.initializeApp(
    {
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://test-cloud-functions-8b68c.firebaseio.com',
        storageBucket: 'test-cloud-functions-8b68c.appspot.com'
    }
);


const database = admin.database().ref('/items');
const owners = admin.database().ref('/owners');
const authAdmin = admin.auth();
const storage = admin.storage();

exports.addOwner = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'POST') {
            return res.status(401).json({
                message: 'Not allowed'
            })
        }

        const item = req.body;
        owners.push(item, () => {
            return res.status(200).json(item);
        });
    });
});

exports.getOwnerOfAnimal = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'POST') {
            return res.status(401).json({
                message: 'Not allowed'
            })
        }

        const { email } = req.body;
        owners.orderByChild("email").equalTo(email).on('value', snapshot => {
            console.table("ABC", "DEF")
            let item = snapshot.val();
            if (item !== null && typeof item !== 'undefined') {
                let users = Object.values(item);
                res.status(200).json(users);
            }
        })
    });
});



const getItemsFromDatabase = (res) => {
    let items = [];

    return database.on('value', (snapshot) => {
        snapshot.forEach((item) => {
            items.push({
                id: item.key,
                item: item.val().item
            });
        });
        res.status(200).json(items);
    }, (error) => {
        res.status(error.code).json({
            message: `Something went wrong. ${error.message}`
        })
    })
};

exports.addItem = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'POST') {
            return res.status(401).json({
                message: 'Not allowed'
            })
        }

        const item = req.body.item;
        database.push({ item });
        getItemsFromDatabase(res)
    });
});

exports.makeItemQueriablePropperty = functions.database.ref('/items/{pushId}/')
    .onCreate((snapshot, context) => {
        // Grab the current value of what was written to the Realtime Database.
        let info = snapshot.val();
        let item_owner = item.item + "_" + item.owner;
        // You must return a Promise when performing asynchronous tasks inside a Functions such as
        // writing to the Firebase Realtime Database.
        // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
        return snapshot.ref.child('item_owner').set(item_owner);
    });



exports.getItems = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'GET') {
            return res.status(401).json({
                message: 'Not allowed'
            });
        }
        getItemsFromDatabase(res)
    });
});

exports.delete = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'DELETE') {
            return res.status(401).json({
                message: 'Not allowed'
            })
        }
        const id = req.query.id
        admin.database().ref(`/items/${id}`).remove()
        getItemsFromDatabase(res)
    })
});

exports.update = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'POST') {
            return res.status(401).json({
                message: 'Not allowed'
            })
        }
        const { id, item } = req.body;
        let ref = admin.database().ref(`/items`);
        ref.child(`/${id}`).once("value", (snapshot) => {
            if (snapshot.exists()) {
                admin.database().ref(`/items/${id}`).update({ item });
                getItemsFromDatabase(res)
            } else {
                return res.status(400).json({
                    message: 'ID not found'
                })
            }
        })

    })
});

const validText = (txt) => {
    if (txt !== null && typeof txt === "string" && txt.trim().length > 0) {
        return true;
    }
    return false
}

const createCustomToken = (res, userRecord) => {
    var uid = userRecord.uid;
    console.log(userRecord.toJSON());
    return authAdmin.createCustomToken(uid)
        .then((customToken) => {
            // Send token back to client
            return res.status(200).json({
                message: 'success',
                status: true,
                "uid": userRecord.uid,
                "token": customToken
            })
        })
        .catch((error) => {
            return res.status(400).json({
                message: JSON.stringify(error)
            });
        });
};

exports.createUser = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'POST') {
            return res.status(401).json({
                message: 'Not allowed'
            })
        }
        let { email = null, password = null, displayName = "", photoURL = "", } = req.body;
        if (!validText(email) || !validText(password)) {
            return res.status(400).json({
                message: "email or password missed!"
            });
        }
        displayName = displayName !== null && typeof displayName !== 'undefined' ? displayName : email;
        authAdmin.createUser({
            email,
            password,
            displayName,
            photoURL,
            emailVerified: true,
            disabled: false
        })
            .then((userRecord) => {
                return createCustomToken(res, userRecord)
            })
            .catch(({ message }) => {
                return res.status(400).json({
                    message
                });
            });


    })
});

exports.updateUser = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'POST') {
            return res.status(401).json({
                message: 'Not allowed'
            })
        }
        let { user_id = "", email = null, password = null, photoURL = "", displayName = "" } = req.body;

        let params = {};
        if (validText(email)) {
            params.email = email;
        }

        if (validText(password)) {
            params.password = password;
        }

        if (validText(photoURL)) {
            params.photoURL = photoURL;
        }

        if (validText(displayName)) {
            params.displayName = displayName;
        }

        if (Object.keys(params).length === 0) {
            return res.status(400).json({
                status: false,
                message: "nothing to update"
            });
        }


        authAdmin.updateUser(user_id, params)
            .then((userRecord) => {

                return res.status(200).json({
                    message: 'success',
                    status: true,
                    "user": userRecord
                })
            })
            .catch(({ message }) => {
                return res.status(400).json({
                    message
                });
            });


    })
});


exports.getUserProfile = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'POST') {
            return res.status(401).json({
                message: 'Not allowed'
            })
        }
        try {
            let { email = null } = req.body;
            if (!validText(email)) {
                return res.status(400).json({
                    message: "email is missed!"
                });
            }

            authAdmin.getUserByEmail(email)
                .then(user => {
                    return res.status(200).json({
                        user: Object.assign({}, user.toJSON())
                    })

                }).catch(({ message }) => {
                    return res.status(400).json({
                        message
                    });
                });


        } catch (error) {
            return res.status(400).json({
                message
            });
        }

    })
});


exports.getToken = functions.https.onCall((data, context) => {
    if (data.user_id === context.auth.uid) {
        return authAdmin.createCustomToken(context.auth.uid)
            .then((customToken) => {
                // Send token back to client
                return {
                    message: 'success',
                    status: true,
                    "uid": context.auth.uid,
                    "token": customToken
                }
            })
            .catch((error) => {
                return {
                    message: JSON.stringify(error)
                }
            });
    }
});


exports.uploadFile_old = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'POST') {
            return res.status(401).json({
                message: 'Not allowed'
            })
        }
        const { base64Image, fileName, contentType } = req.body;
        var stream = require('stream');
        var bufferStream = new stream.PassThrough();
        bufferStream.end(Buffer.from(base64Image, 'base64'));
        //Define bucket.
        var myBucket = storage.bucket();
        //Define file & file name.
        var file = myBucket.file(fileName);

        //Pipe the 'bufferStream' into a 'file.createWriteStream' method.
        bufferStream.pipe(file.createWriteStream({
            metadata: {
                contentType,
                fileName,
                metadata: {
                    custom: 'metadata'
                }
            },
            public: true,
            validation: "md5"
        }))
            .on('error', (err) => {
                return res.status(401).json({
                    message: JSON.stringify(err)
                })
            })
            .on('finish', () => {
                // The file upload is complete.
                return file.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                }).then(signedUrls => {
                    // signedUrls[0] contains the file's public URL
                    return res.status(200).json({
                        message: 'upload done',
                        status: true,
                        url: signedUrls
                    })
                }).catch(({ message }) => {
                    return res.status(400).json({
                        message
                    });
                });

            });
    })
});


exports.uploadFile = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'POST') {
            return res.status(401).json({
                message: 'Not allowed'
            })
        }
        const { base64Image, fileName, contentType } = req.body;
        var buffer = new Buffer(base64Image, 'base64');
        //Define bucket.
        var myBucket = storage.bucket();
        //Define file & file name.
        var file = myBucket.file(fileName);

        file.save(buffer, {
            metadata: {
                fileName,
                contentType,
            },
            public: true,
            validation: "md5"
        }, (error) => {
            if (error) {
                return res.status(400).json({
                    error: error.message
                });
            } else {
                return file.getSignedUrl({
                    action: 'read',
                    expires: '09-09-9999'
                }).then(signedUrls => {
                    // signedUrls[0] contains the file's public URL
                    return res.status(200).json({
                        path: fileName,
                        contentType,
                        message: 'upload done',
                        status: true,
                        url: signedUrls
                    })
                }).catch(({ message }) => {
                    return res.status(400).json({
                        message
                    });
                });
            }
        })

    })
});
