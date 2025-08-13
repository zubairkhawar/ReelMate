const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key instead of anon key

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing');
  console.error('');
  console.error('Please add SUPABASE_SERVICE_ROLE_KEY to your .env file');
  console.error('You can find this in your Supabase dashboard under Settings > API');
  process.exit(1);
}

// Create client with service role key (has admin privileges)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAvatarBucket() {
  try {
    console.log('🔄 Setting up avatar bucket...');
    
    // Check if bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError);
      return false;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === 'avatars');
    
    if (bucketExists) {
      console.log('✅ Avatar bucket already exists');
      return true;
    }
    
    console.log('📦 Creating avatar bucket...');
    
    // Create the bucket with proper settings
    const { error: createError } = await supabase.storage.createBucket('avatars', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      fileSizeLimit: 5 * 1024 * 1024 // 5MB
    });
    
    if (createError) {
      console.error('❌ Error creating bucket:', createError);
      return false;
    }
    
    console.log('✅ Avatar bucket created successfully!');
    
    // Set up storage policies for the bucket
    console.log('🔐 Setting up storage policies...');
    
    // Policy to allow authenticated users to upload avatars
    const { error: uploadPolicyError } = await supabase.rpc('create_storage_policy', {
      bucket_name: 'avatars',
      policy_name: 'Allow authenticated users to upload avatars',
      policy_definition: `
        (bucket_id = 'avatars'::text) AND 
        (auth.role() = 'authenticated') AND
        (storage.foldername(name))[1] = auth.uid()::text
      `
    });
    
    if (uploadPolicyError) {
      console.log('⚠️  Note: Could not set upload policy automatically. You may need to set this manually in Supabase dashboard.');
      console.log('   Error:', uploadPolicyError.message);
    } else {
      console.log('✅ Upload policy set successfully');
    }
    
    // Policy to allow public read access to avatars
    const { error: readPolicyError } = await supabase.rpc('create_storage_policy', {
      bucket_name: 'avatars',
      policy_name: 'Allow public read access to avatars',
      policy_definition: `
        (bucket_id = 'avatars'::text) AND 
        (storage.foldername(name))[1] IS NOT NULL
      `
    });
    
    if (readPolicyError) {
      console.log('⚠️  Note: Could not set read policy automatically. You may need to set this manually in Supabase dashboard.');
      console.log('   Error:', readPolicyError.message);
    } else {
      console.log('✅ Read policy set successfully');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 ReelMate Avatar Bucket Setup');
  console.log('================================');
  console.log('');
  
  const success = await setupAvatarBucket();
  
  if (success) {
    console.log('');
    console.log('🎉 Setup completed successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Restart your backend server');
    console.log('2. Try uploading an avatar again');
    console.log('');
    console.log('If you still have issues, check the Supabase dashboard:');
    console.log('   Storage > Buckets > avatars');
    console.log('   Make sure the bucket is public and policies are set correctly');
  } else {
    console.log('');
    console.log('❌ Setup failed. Please check the errors above.');
    console.log('');
    console.log('Manual setup in Supabase dashboard:');
    console.log('1. Go to Storage > New bucket');
    console.log('2. Name: avatars');
    console.log('3. Public bucket: Yes');
    console.log('4. File size limit: 5MB');
    console.log('5. Allowed MIME types: image/jpeg, image/png, image/webp');
  }
}

// Run the setup
main().catch(console.error);
