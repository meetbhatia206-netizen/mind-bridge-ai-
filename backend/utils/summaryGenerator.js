function generateSummary(formId, answers, lang) {
  if (formId === 'aadhaar') {
    return generateAadhaarHtmlGuide(answers, lang);
  }
  return `<h3>Basic Summary</h3><p>Your answers have been recorded.</p>`;
}

function generateAadhaarHtmlGuide(answers, lang) {
  const isHi = lang === 'hi';
  const tick = '<b>[✔]</b>';

  // Extract variables
  const residentType = answers.resident_type?.toLowerCase().includes('nri') ? 'NRI' : 'Resident Indian';
  const isUpdate = answers.app_type?.toLowerCase().includes('update');
  const appType = isUpdate ? 'Update' : 'New Enrolment';
  
  const vType = (answers.verification_type || '').toLowerCase();
  const isDoc = vType.includes('document');
  const isIntro = vType.includes('introducer');
  const isHof = vType.includes('hof');

  const dobVerified = answers.dob_declared_verified?.toLowerCase() === 'verified';

  const hasCo = answers.has_co?.toLowerCase() === 'yes' || answers.has_co === 'हाँ';
  const under18 = answers.age_group?.toLowerCase() !== 'yes' && answers.age_group !== 'हाँ';

  // We build HTML but stylize it exactly like the requested Markdown
  let guide = `
  <div style="font-family: inherit; line-height: 1.6; color: var(--text-main);">
    <h2 style="border-bottom: 2px solid var(--accent); padding-bottom: 8px; margin-bottom: 20px;">
      ${isHi ? 'आधार फॉर्म भरने की मार्गदर्शिका' : 'Aadhaar Form Filling Guide'}
    </h2>
    <p style="margin-bottom: 20px;">
      ${isHi ? 'अपने भौतिक फॉर्म को भरने के लिए इन चरण-दर-चरण निर्देशों का पालन करें:' : 'Follow these step-by-step instructions to fill out your physical form:'}
    </p>

    <!--------------------------------------------- SECTION 1 & 2 --------------------------------------------->
    <h3 style="color: var(--accent); margin-top: 25px;">${isHi ? 'अनुभाग 1 और 2: बुनियादी जानकारी' : 'Section 1 & 2: The Basics'}</h3>
    <ul style="list-style-type: none; padding-left: 0;">
      <li style="margin-bottom: 6px;">
        Tick ${tick} <b>${residentType}</b>
      </li>
      <li style="margin-bottom: 6px;">
        Tick ${tick} <b>${appType}</b>
      </li>
      ${
        answers.pre_enrolment_id 
        ? `<li style="margin-bottom: 6px;">Write Pre-Enrolment ID: <b>${answers.pre_enrolment_id}</b></li>`
        : `<li style="margin-bottom: 6px; color: var(--text-muted);">Leave Pre-Enrolment ID blank.</li>`
      }
      ${
        isUpdate && answers.uid_eid_number 
        ? `<li style="margin-bottom: 6px;">Write ${answers.id_type_update || 'Aadhaar Number'}: <b>${answers.uid_eid_number}</b></li>` 
        : ''
      }
    </ul>

    <!--------------------------------------------- SECTION 3 --------------------------------------------->
    <h3 style="color: var(--accent); margin-top: 25px;">${isHi ? 'अनुभाग 3: जनसांख्यिकी' : 'Section 3: Demographic Information'}</h3>
    <ul style="list-style-type: none; padding-left: 0;">
      <li style="margin-bottom: 6px;">
        Write Full Name: <b>${answers.full_name || '______________'}</b>
      </li>
      <li style="margin-bottom: 6px;">
        Tick ${tick} <b>${answers.gender || '______________'}</b>
      </li>
      <li style="margin-bottom: 6px;">
        Write Date of Birth: <b>${answers.age_or_dob || '______________'}</b> 
        (Format: DD/MM/YYYY or Age in Years)
      </li>
      <li style="margin-bottom: 6px;">
        ${dobVerified ? `Tick ${tick} <b>Verified</b> (Attach proof)` : `Tick ${tick} <b>Declared</b>`}
      </li>
    </ul>

    <!--------------------------------------------- SECTION 4 --------------------------------------------->
    <h3 style="color: var(--accent); margin-top: 25px;">${isHi ? 'अनुभाग 4: अपडेट विवरण' : 'Section 4: Update Details'}</h3>
    <ul style="list-style-type: none; padding-left: 0;">
      ${
        isUpdate 
        ? `<li style="margin-bottom: 6px;">Tick boxes corresponding to: <b>${answers.update_fields || ''}</b></li>` 
        : `<li style="margin-bottom: 6px; color: var(--text-muted);">Skip this section since this is a New Enrolment.</li>`
      }
    </ul>

    <!--------------------------------------------- SECTION 5 & 6 --------------------------------------------->
    <h3 style="color: var(--accent); margin-top: 25px;">${isHi ? 'अनुभाग 5 और 6: पता' : 'Section 5 & 6: Address Details'}</h3>
    <ul style="list-style-type: none; padding-left: 0;">
      ${
        hasCo 
        ? `<li style="margin-bottom: 6px;">Write Care of (C/o): <b>${answers.address_co}</b></li>` 
        : `<li style="margin-bottom: 6px; color: var(--text-muted);">Leave Care of (C/o) blank.</li>`
      }
      <li style="margin-bottom: 6px;">Write House No./ Bldg: <b>${answers.address_house || '______________'}</b></li>
      <li style="margin-bottom: 6px;">Write Area/Sector: <b>${answers.address_area || '______________'}</b></li>
      <li style="margin-bottom: 6px;">Write Village/Town/City: <b>${answers.address_village || '______________'}</b></li>
      <li style="margin-bottom: 6px;">Write District: <b>${answers.address_district || '______________'}</b></li>
      <li style="margin-bottom: 6px;">Write State: <b>${answers.address_state || '______________'}</b></li>
      <li style="margin-bottom: 6px;">Write PIN Code: <b>${answers.pin_code || '______________'}</b></li>
      <li style="margin-bottom: 6px;">Write Mobile No: <b>${answers.mobile_no || '______________'}</b></li>
      ${
        answers.email 
        ? `<li style="margin-bottom: 6px;">Write E-Mail: <b>${answers.email}</b></li>`
        : `<li style="margin-bottom: 6px; color: var(--text-muted);">Leave E-Mail blank.</li>`
      }
      ${
        under18
        ? `<li style="margin-bottom: 6px; margin-top:10px; color:#f59e0b;">
             <b>Minor Alert:</b> Since you are under 18, write ${answers.relative_details_type || 'Guardian'} details: 
             Name: <b>${answers.relative_name || ''}</b> | Aadhaar: <b>${answers.relative_aadhaar || ''}</b>
           </li>`
        : `<li style="margin-bottom: 6px; margin-top:10px; color: var(--text-muted);">Since you are 18+, skip Guardian details.</li>`
      }
    </ul>

    <!--------------------------------------------- SECTION 7 & 8 --------------------------------------------->
    <h3 style="color: var(--accent); margin-top: 25px;">${isHi ? 'अनुभाग 7 और 8: सत्यापन प्रकार' : 'Section 7 & 8: Verification'}</h3>
    <ul style="list-style-type: none; padding-left: 0;">
      ${
        isDoc
        ? `
          <li style="margin-bottom: 6px;">Tick ${tick} <b>Document Based</b></li>
          <li style="margin-bottom: 6px;">Write POI (Identity): <b>${answers.poi_doc || '______________'}</b></li>
          <li style="margin-bottom: 6px;">Write POA (Address): <b>${answers.poa_doc || '______________'}</b></li>
          ${answers.dob_doc ? `<li style="margin-bottom: 6px;">Write DOB (Birth Proof): <b>${answers.dob_doc}</b></li>` : ''}
          ${answers.por_doc ? `<li style="margin-bottom: 6px;">Write POR (Relationship): <b>${answers.por_doc}</b></li>` : ''}
          <li style="margin-bottom: 6px; color: var(--text-muted);"><b>Instruction:</b> Skip Introducer and HOF sections.</li>
        `
        : isIntro
        ? `
          <li style="margin-bottom: 6px;">Tick ${tick} <b>Introducer Based</b></li>
          <li style="margin-bottom: 6px; color: var(--text-muted);"><b>Instruction:</b> Skip Document and HOF sections. Complete Introducer details.</li>
          <li style="margin-bottom: 6px;">Write Introducer's Aadhaar: <b>${answers.introducer_aadhaar || '______________'}</b></li>
        `
        : isHof
        ? `
          <li style="margin-bottom: 6px;">Tick ${tick} <b>Head of Family (HOF) Based</b></li>
          <li style="margin-bottom: 6px; color: var(--text-muted);"><b>Instruction:</b> Skip Document and Introducer sections. Complete HOF details.</li>
          <li style="margin-bottom: 6px;">Tick Relationship: <b>${answers.hof_type || '______________'}</b></li>
          <li style="margin-bottom: 6px;">Write HOF's Aadhaar: <b>${answers.hof_aadhaar || '______________'}</b></li>
        `
        : `<li style="margin-bottom: 6px;">Tick your preferred Verification type.</li>`
      }
    </ul>

    <!--------------------------------------------- SECTION 9 --------------------------------------------->
    <h3 style="color: var(--accent); margin-top: 25px;">${isHi ? 'अनुभाग 9: सहमति' : 'Section 9: Confirmation'}</h3>
    <ul style="list-style-type: none; padding-left: 0;">
      <li style="margin-bottom: 6px;">Ensure you read the disclosure.</li>
      <li style="margin-bottom: 6px;">Write Applicant's Name / Date / Time at the bottom block.</li>
    </ul>

    <!--------------------------------------------- FINAL STEP --------------------------------------------->
    <h3 style="color: var(--accent); margin-top: 25px;">${isHi ? 'अंतिम चरण' : 'Final Step'}</h3>
    <ul style="list-style-type: none; padding-left: 0;">
      <li style="margin-bottom: 6px;">Sign inside the box or provide your thumb impression.</li>
      ${
        under18 || isHof || isIntro
        ? `<li style="margin-bottom: 6px; color: #f59e0b;"><b>Important:</b> Ensure your HOF, Introducer, or Guardian also signs near their respective section.</li>`
        : ''
      }
    </ul>

    <!--------------------------------------------- CHECKLIST --------------------------------------------->
    <div style="margin-top:30px; padding:20px; border-radius:12px; border:2px solid var(--accent); background:rgba(34, 211, 238, 0.05);">
        <h3 style="margin-top:0; color:var(--accent);">📌 Checklist Before Visiting Center</h3>
        <ul style="list-style-type: none; padding-left: 0;">
            <li style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                <input type="checkbox" style="transform: scale(1.2);"> 
                <span>Carry the filled form.</span>
            </li>
            ${
              isDoc 
              ? `
              <li style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                  <input type="checkbox" style="transform: scale(1.2);"> 
                  <span>Bring <b>ORIGINAL</b> documents (${answers.poi_doc || 'POI'}, ${answers.poa_doc || 'POA'}).</span>
              </li>` 
              : ''
            }
            ${
              dobVerified 
              ? `
              <li style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                  <input type="checkbox" style="transform: scale(1.2);"> 
                  <span>Bring <b>ORIGINAL</b> DOB document (${answers.dob_doc || 'Birth Proof'}).</span>
              </li>`
              : ''
            }
            ${
              isHof || under18
              ? `
              <li style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                  <input type="checkbox" style="transform: scale(1.2);"> 
                  <span>Make sure HOF / Guardian is physically present with their Aadhaar.</span>
              </li>`
              : ''
            }
        </ul>
    </div>
  </div>
  `;

  return guide;
}

module.exports = { generateSummary };
