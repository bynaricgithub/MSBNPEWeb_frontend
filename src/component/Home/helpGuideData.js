// src/data/helpGuideData.js

const helpGuideData = [
  {
    value: "vendor",
    label: "Online Bills and Refunds - Vendor / Party Registration",
    date: "18-Apr-2021",
    description:
      "Vendor / party could be any one who is providing services to Maharashtra Nursing Council and raising bills for their services. Also other entities like Nursing Institutes / Nurses can register as party to claim various payments and refunds.",
    link: {
      label: "Click Here for Online Bills and Refunds",
      href: "https://www.mncouncil.com/BPSWeb",
    },
    steps: [
      {
        title: "Step 1",
        content: (
          <>
            Click on <strong>Online Bills and Refunds</strong> in menu on MNC Website or visit link{" "}
            <a href="https://www.mncouncil.com/BPSWeb" target="_blank" rel="noopener noreferrer">
              https://www.mncouncil.com/BPSWeb
            </a>
            .<br />
            Once link is open click on <strong>New Party</strong>.
          </>
        ),
      },
      {
        title: "Step 2",
        content: (
          <>
            <strong>Mobile Number Verification</strong>
            <br />
            Enter your Mobile Number and submit. You will get an OTP for Mobile Number verification. <br />
            Enter OTP sent to your entered Mobile Number.
          </>
        ),
      },
      {
        title: "Step 3",
        content: (
          <>
            <strong>Set Password for your profile</strong>
            <br />
            Once correct OTP is entered, system will ask you to set Password for your profile — enter password, confirm password and submit.
            System will redirect you to login page. Now login with Mobile Number as USER ID and PASSWORD.
          </>
        ),
      },
      {
        title: "Step 4",
        content: (
          <>
            <strong>Enter Vendor / Party Details</strong>
            <br />
            Once logged in, it will redirect you to Profile Page. Select your Party Category e.g. Vendor, Institute, Examiner, Nurse etc.
            and fill in profile details. Save details.
          </>
        ),
      },
      {
        title: "Step 5",
        content: (
          <>
            <strong>Complete Profile and Submit for approval</strong>
            <br />
            Once saved, system will redirect you to Party Profile page. Enter Address, Bank Account Details and required documents. Submit
            the profile for approval. Department will approve or reject the profile.
          </>
        ),
      },
      {
        title: "Step 6",
        content: (
          <>
            <strong>Send Bill or Refund request to MNC</strong>
            <br />
            Once profile is approved, visit <strong>Bills / Refunds</strong> section and click on New Bill / Refund. Select category, fill
            details, upload required documents and submit the bill.
          </>
        ),
      },
    ],
  },

  {
    value: "cneWorkshop",
    label: "CNE Workshop Organizers Workflow",
    date: "01-Jan-2017",
    description: "Following are the steps for getting registered with MNC to organize CNE Workshops. Go through the following steps.",
    link: {
      label: "Click here to access MNC CNE System",
      href: "https://www.maharashtranursingcouncil.org/CNE/CNELogin.aspx",
    },
    steps: [
      {
        title: "Step 1",
        content: (
          <>
            <strong>Create Organizer Account</strong>
            <br />
            Visit{" "}
            <a href="https://www.maharashtranursingcouncil.org/CNE/CNELogin.aspx" target="_blank" rel="noopener noreferrer">
              www.maharashtranursingcouncil.org/CNE/CNELogin.aspx
            </a>{" "}
            and create new login by clicking on New Registration.
            <br />
            Provide correct information as this data will be used for communication and printing on documents.
          </>
        ),
      },
      {
        title: "Step 2",
        content: (
          <>
            <strong>CNE Accreditation Application</strong>
            <br />
            Once new Organizer Account is created, login into the system and fill requested details and submit CNE Accreditation
            Application.
            <br />
            Your CNE Accreditation Application will be verified and approved/rejected by MNC CNE Committee Members.
          </>
        ),
      },
      {
        title: "Step 3",
        content: (
          <>
            <strong>Pay Yearly Accreditation Fees</strong>
            <br />
            Once CNE Accreditation Application is approved, you can pay your yearly CNE Accreditation fees.
          </>
        ),
      },
      {
        title: "Step 4",
        content: (
          <>
            <strong>Workshop Application</strong>
            <br />
            After paying CNE Accreditation Application fees, you will be able to apply for CNE Workshop. Select New Workshop Application
            from menu, and fill requested details and Submit Workshop Application.
            <br />
            Your CNE Workshop Application will also be verified and approved/rejected by MNC CNE Committee Members.
          </>
        ),
      },
      {
        title: "Step 5",
        content: (
          <>
            <strong>CNE Workshop Schedule</strong>
            <br />
            Once the CNE Workshop Application is approved, CNE Points and Observer will be assigned for Workshop by MNC CNE Committee
            Members.
            <br />
            Now this workshop will be displayed in CNE Schedule on MNC Website.
          </>
        ),
      },
    ],
  },

  {
    value: "onlineCneOrganizer",
    label: "Online CNE Organizers Workflow",
    date: "01-Jan-2017",
    description: "Following are the steps for getting registered with MNC to organize Online CNE. Go through following steps.",
    link: {
      label: "Click here to access MNC CNE System",
      href: "https://www.maharashtranursingcouncil.org/CNE/CNELogin.aspx",
    },
    steps: [
      {
        title: "Step 1",
        content: (
          <>
            <strong>Create Organizer Account</strong>
            <br />
            Visit{" "}
            <a href="https://www.maharashtranursingcouncil.org/CNE/CNELogin.aspx" target="_blank" rel="noopener noreferrer">
              www.maharashtranursingcouncil.org/CNE/CNELogin.aspx
            </a>{" "}
            and create new login by clicking on New Registration.
            <br />
            Provide correct information as this data will be used for communication and printing on documents.
          </>
        ),
      },
      {
        title: "Step 2",
        content: (
          <>
            <strong>CNE Accreditation Application</strong>
            <br />
            Once new Organizer Account is created, log into the system and fill requested details and submit CNE Accreditation Application.
            <br />
            Your CNE Accreditation Application will be verified and approved/rejected by MNC CNE Committee Members.
          </>
        ),
      },
      {
        title: "Step 3",
        content: (
          <>
            <strong>Pay Yearly Accreditation Fees</strong>
            <br />
            Once CNE Accreditation Application is approved, you can pay your yearly CNE Accreditation fees.
          </>
        ),
      },
      {
        title: "Step 4",
        content: (
          <>
            <strong>Workshop Application</strong>
            <br />
            After paying CNE Accreditation fees, you will be able to apply for CNE Workshop.
            <br />
            Select New Workshop Application from menu, and fill requested details (e.g. Link for online CNE etc.) and Submit Workshop
            Application.
            <br />
            Workshop period will be 2 months for online CNE.
            <br />
            Your CNE Workshop Application will also be verified and approved/rejected by MNC CNE Committee Members.
          </>
        ),
      },
      {
        title: "Step 5",
        content: (
          <>
            <strong>Online CNE Schedule</strong>
            <br />
            Once the CNE Workshop Application is approved, this workshop will be displayed in CNE Schedule on MNC Website as Online CNE.
          </>
        ),
      },
      {
        title: "Step 6",
        content: (
          <>
            <strong>Participant List</strong>
            <br />
            Students interested in participating in Online CNE can select Online CNE Subject of their choice and add themselves online in
            the participant list.
            <br />
            You will get Workshop Participants list in your login.
            <br />
            You can download this participant data in Excel format and upload in your online CNE program.
            <br />
            And allow only these students to participate in Online CNE.
          </>
        ),
      },
      {
        title: "Step 7",
        content: (
          <>
            <strong>Certificate of Participation</strong>
            <br />
            As and when the student completes Online CNE, mark participated candidates as present or absent and can collect proposed
            participant fees.
            <br />
            Organizers will be able to generate Certificate of Participation for attended candidates only.
            <br />
            Organizer will issue Certificate of Participation to all the participants with signature and stamp of respective organization.
            <br />
            Only Certificate generated from MNC CNE System (with MNCN Barcode) will be considered as valid Certificate of Participation and
            only those students having valid certificates will get respective credit points.
          </>
        ),
      },
    ],
  },

  {
    value: "cneObserver",
    label: "CNE Observers Workflow",
    date: "01-Jan-2017",
    description: "Following are the steps for getting registered with MNC as CNE Observer. Go through following steps.",
    link: {
      label: "Click here to access MNC CNE System",
      href: "https://www.maharashtranursingcouncil.org/CNE/CNELogin.aspx",
    },
    steps: [
      {
        title: "Step 1",
        content: (
          <>
            <strong>Create Observer Account</strong>
            <br />
            Visit{" "}
            <a href="https://www.maharashtranursingcouncil.org/CNE/CNELogin.aspx" target="_blank" rel="noopener noreferrer">
              www.maharashtranursingcouncil.org/CNE/CNELogin.aspx
            </a>{" "}
            and create new login by clicking on New Registration.
            <br />
            Provide correct information as this data will be used for communication and printing on documents.
          </>
        ),
      },
      {
        title: "Step 2",
        content: (
          <>
            <strong>CNE Observer Application</strong>
            <br />
            Once new Observer Account is created, log in to the system and fill requested details and submit Observer Application.
            <br />
            Your Observer Application will be verified and approved/rejected by MNC CNE Committee Members.
          </>
        ),
      },
      {
        title: "Step 3",
        content: (
          <>
            <strong>MNC Verified Observer</strong>
            <br />
            Once Observer Application is approved, you will be added to the MNC Verified Observer List.
            <br />
            Whenever you are selected as Observer for any CNE Workshop, MNC CNE Committee Members will intimate you for the same by letter.
          </>
        ),
      },
      {
        title: "Step 4",
        content: (
          <>
            <strong>Observer remarks on CNE Workshop</strong>
            <br />
            On the last day of CNE, Observer will have to give their remarks on the attended CNE Workshop.
          </>
        ),
      },
    ],
  },
  {
    value: "cneSpeaker",
    label: "CNE Speaker Workflow",
    date: "01-Jan-2017",
    description: "Following are the steps for getting registered with MNC as CNE Speaker. Go through following steps.",
    link: {
      label: "Click here to access MNC CNE System",
      href: "https://www.maharashtranursingcouncil.org/CNE/CNELogin.aspx",
    },
    steps: [
      {
        title: "Step 1",
        content: (
          <>
            <strong>Create Speaker Account</strong>
            <br />
            Visit{" "}
            <a href="https://www.maharashtranursingcouncil.org/CNE/CNELogin.aspx" target="_blank" rel="noopener noreferrer">
              www.maharashtranursingcouncil.org/CNE/CNELogin.aspx
            </a>{" "}
            and create new login by clicking on New Registration.
            <br />
            Provide correct information as this data will be used for communication and printing on documents.
          </>
        ),
      },
      {
        title: "Step 2",
        content: (
          <>
            <strong>CNE Speaker Application</strong>
            <br />
            Once new Speaker Account is created, log in to the system and fill requested details and submit Speaker Application.
            <br />
            Your Speaker Application will be verified and approved/rejected by MNC CNE Committee Members.
          </>
        ),
      },
      {
        title: "Step 3",
        content: (
          <>
            <strong>MNC Verified Speaker</strong>
            <br />
            Once Speaker Application is approved, you will be added to MNC Verified Speaker List.
            <br />
            Whenever you are selected as Speaker for any CNE Workshop, MNC CNE Committee Members will intimate you for the same by letter.
          </>
        ),
      },
    ],
  },

  {
    value: "cneParticipants",
    label: "CNE Participants / Students Workflow",
    date: "01-Jan-2017",
    description: "Following are the steps for participating in CNE Workshops and earning CNE Credit Points. Go through following steps.",
    link: {
      label: "Click here to access MNC CNE System",
      href: "https://www.maharashtranursingcouncil.org/CNE/CNELogin.aspx",
    },
    steps: [
      {
        title: "Step 1",
        content: (
          <>
            <strong>View CNE Schedule</strong>
            <br />
            You can view CNE Workshop Schedule displayed on MNC website. You will be able to list all of upcoming CNE Workshop List.
            <br />
            For Nurses residing in India, only 1 Online CNE Point out of 5 will be valid for every year. For Nurses not residing in India,
            all 5 Online CNE Point or equivalent CNE attended by them abroad will be considered valid.
          </>
        ),
      },
      {
        title: "Step 2",
        content: (
          <>
            <strong>Apply for CNE Workshop</strong>
            <br />
            Select CNE Workshop from the list and view details. You can apply to CNE Workshop just by clicking on Apply button.
            <br />
            For offline CNE Workshop, you have to be present on workshop venue on the day of workshop.
            <br />
            For Online CNE, 1 day after applying for Online CNE you have to visit the Online CNE link provided in Workshop Details.
          </>
        ),
      },
      {
        title: "Step 3",
        content: (
          <>
            <strong>Attend CNE Workshop</strong>
            <br />
            For offline CNE Workshop you have to be present on workshop venue on the day of workshop.
            <br />
            For Online CNE, 1 day after applying for Online CNE you have to visit the Online CNE link provided in Workshop Details.
          </>
        ),
      },
      {
        title: "Step 4",
        content: (
          <>
            <strong>Don't forget to collect Certificate of Participation</strong>
            <br />
            Organizers will issue Certificate of Participation to all the participants with signature and stamp of respective organization.
            You will get Online CNE Certificates by post.
            <br />
            Only Certificates generated from MNC CNE System (with MCN Barcode) will be considered as valid Certificate of Participation.
            <br />
            Only those students having valid certificates will get respective credit points.
          </>
        ),
      },
    ],
  },
];

export default helpGuideData;
