ChangeLog - 1/5/2025 - Frontend Fixes

* Am rezolvat problemele de import si injectare pentru serviciile Angular:
  - Corectat import path pentru AuthService in UserService
  - Rezolvat eroarea de injection token pentru AuthService
  - Verificat si confirmat functionalitatea corecta a serviciilor

ChangeLog - 30/3/2025 - Claudiu

* Am modificat Bug Id sa fie BIGSERIAL (auto - increment) in BD si in Java, nu mai este necesar sa adaugam id manual.
* Am schimbat in BD BIGINT in loc de INT pentru foreign-key-urile catre ID-urile care se incrementeaza.
* Logica a fost mutata din Controller in Service; Controller se ocupa acum strict doar de apelulurile catre servicii.
* Parola va fi criptata acum cu BCrypt, algoritm safe. -> A fost creat un nou GET care returneaza boolean in cazul in care username-ul
si parola se potrivesc.

ChangeLog - Liviu

* Am testat manual toate endpoint-urile API-ului folosind Postman:
  - Users API: register, getUser, getAllUsers, deleteUser, updateUser, checkPass
  - Bug API: createBug, getBug, getAllBugs, deleteBug, updateBug
  - Comment API: createComment, getComment, getAllComments, deleteComment, updateComment
* Am rescris testele pentru a acoperi toate functionalitatile:
  - UserServiceTest: testele pentru operatiunile CRUD pe utilizatori
  - BugServiceTest: testele pentru operatiunile CRUD pe bug-uri
  - CommentServiceTest: testele pentru operatiunile CRUD pe comentarii
  - EntityRelationshipTest: testele pentru relatiile dintre entitati (Bug-Comment, User-Bug, User-Comment)
* Toate testele au fost validate cu succes, confirmand functionalitatea corecta a aplicatiei

* Am adaugat anotari pentru gestionarea relatiilor intre entitati:
  - @JsonIgnoreProperties pentru a preveni probleme de serializare cu lazy loading
  - @JsonBackReference pentru a gestiona relatiile bidirectionale in JSON
  - @OneToMany cu cascade si orphanRemoval pentru gestionarea automatizata a entitatilor copil
* Am implementat lazy loading pentru optimizarea performantei
* Am rezolvat probleme de recursivitate infinita in serializarea JSON
* Am adaugat cascade operations pentru a mentine consistenta datelor
* Am implementat orphanRemoval pentru a preveni comentarii orfane in baza de date

ChangeLog - Frontend Setup (29/4/2025)

* Am creat structura de baza a aplicatiei Angular:
  - Configurare proiect cu Angular CLI
  - Implementare modele pentru entitati (User, Bug, Comment, Tag)
  - Creare servicii pentru comunicarea cu backend-ul (Auth, Bug, Comment)
  - Implementare interceptori pentru autentificare si gestionarea erorilor
  - Adaugare guard-uri pentru protectia rutelor (Auth, Moderator)

ChangeLog - Assignment 2 Status (3/5/2025)

✅ | Entity Mapping / Similar
✅ | User pages
⚠️ | Answer/Question Pages
⚠️ | Usage of JSON for Display & Testing / Similar
✅ | Usage of Modules & Components/ Similar
✅ | Clean Code
⚠️ | Usage of Services
❌ | Unit Testing
❌ | Documentation Architecture, tech stack

* Probleme identificate si status:
  - ✅ Autentificare și Redirecționare:
    * Login-ul cu credențiale valide nu redirecționează către /bugs
    * Doar înregistrarea (register) redirecționează către /bugs
    * Necesitate de verificare a logicii de autentificare și redirecționare

  - ❌ Funcționalitate Password Reset:
    * Funcționalitatea de resetare a parolei este doar mock-up
    * Necesitate de implementare a sistemului real de resetare a parolei
    * Soluție propusă: Integrare cu serviciu de email pentru trimiterea link-urilor de reset

  - ✅ Gestionarea Bug-urilor:
    * Eroare la încărcarea bug-urilor după autentificare
    * Mesaj de eroare: "Failed to load bugs. Please try again."
    * Necesitate de investigare a comunicării între frontend și backend pentru operațiunile cu bug-uri

