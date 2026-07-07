import React from 'react';

const Profile = () => {
  return (
    <div className="p-md max-w-container-max mx-auto w-full">
      <div className="mb-xl">
        <h1 className="font-display-sm text-display-sm text-on-surface tracking-tight mb-2">User Profile</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Manage your account settings and credentials.</p>
      </div>

      <div className="bg-white rounded-xl border border-outline-variant p-md shadow-sm max-w-2xl">
        <div className="flex items-center space-x-md mb-xl">
          <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-primary">
            <img 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcmmkiLZ8VDFxDrj9SYOCcQXCS5Nq9wk-m9OoGG6YsHMQK9u218MIZgbRf8HhL-n_r5E0cj-BOkcPK-kOshLTkGsBirYOdDy7Zz3vKLeD9Z__v8o1n2y28nzfLOw9c1hDVXzSSY-GepYDLfUVcnXIenb_qhqds9kYw3biEQQ2N7mLYYTEA9RWKsIKIQLpvaJp8EcttFmaepqozThboUzoFg4-OoJQuJyHPmemGmSTh2r_ndBwUJ3ze" 
              alt="Manager Avatar"
            />
          </div>
          <div>
            <h2 className="font-headline-md text-headline-md">Jonathan Miller</h2>
            <p className="font-body-md text-on-surface-variant">Facility Manager • Berlin Mother Hub</p>
          </div>
        </div>

        <div className="space-y-md">
          <div>
            <label className="font-label-md text-label-md text-outline uppercase block mb-1">Email Address</label>
            <input type="text" readOnly value="j.miller@expiryguard.ai" className="w-full p-2 border border-outline-variant rounded bg-surface-container-low" />
          </div>
          <div>
            <label className="font-label-md text-label-md text-outline uppercase block mb-1">Role / Permissions</label>
            <input type="text" readOnly value="Administrator" className="w-full p-2 border border-outline-variant rounded bg-surface-container-low" />
          </div>
          <div>
            <label className="font-label-md text-label-md text-outline uppercase block mb-1">Security Access Token</label>
            <div className="flex space-x-2">
              <input type="password" readOnly value="••••••••••••••••••••" className="w-full p-2 border border-outline-variant rounded bg-surface-container-low" />
              <button className="bg-primary text-white px-md rounded font-label-md">Reveal</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
