require 'json'

desc "Create a debian package from the binaries."
task :build_dummy_artifact do |task|

  basedir        = '/var/www/udb3-angular-app'

  git_short_ref  = `git rev-parse --short HEAD`.strip
  artifact_name  = 'uitdatabank-angular'
  vendor         = 'publiq VZW'
  maintainer     = 'Infra publiq <infra@publiq.be>'
  license        = 'Apache-2.0'
  description    = 'AngularJS library for UiTDatabank 3 (dummy package)'
  source         = 'https://github.com/cultuurnet/udb3-angular/'
  build_url      = ENV['JOB_DISPLAY_URL'].nil? ? '' : ENV['JOB_DISPLAY_URL']

  bowerfile      = File.read('bower_components/udb3-angular/.bower.json')
  angular_gitref = JSON.parse(bowerfile)['_resolution']['commit'][0,7]

  calver_version = ENV['PIPELINE_VERSION'].nil? ? Time.now.strftime("%Y.%m.%d.%H%M%S") : ENV['PIPELINE_VERSION']
  version        = "#{calver_version}+sha.#{angular_gitref}"

  FileUtils.mkdir_p('empty')
  FileUtils.mkdir_p('pkg')

  system("fpm -s dir -t deb -n #{artifact_name} -v #{version} \
    -a all -p pkg -C empty --prefix #{basedir} \
    --description '#{description}' --url '#{source}' --vendor '#{vendor}' \
    --license '#{license}' -m '#{maintainer}' \
    --deb-field 'Pipeline-Version: #{calver_version}' \
    --deb-field 'Build-Url: #{build_url}' \
    --deb-field 'Git-Ref: #{angular_gitref}' \
    ."
  ) or exit 1
end
