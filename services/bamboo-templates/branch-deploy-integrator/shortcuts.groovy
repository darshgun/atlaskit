createBranchDeployIntegrator([
  'sourceRepo',
  'productRepo',
  'productCiPlanUrl',
  'dockerContainer',
  'packageEngine',
  'integratorCmd',
  'skipIntegrityCheck'
]) {
    project(key:'ABDPI',name:'AFP - Branch Deploy Product Integrators',
      description:'Branch deploy all the things')
    repository(name:'#sourceRepo')
    repository(name:'#productRepo')
    trigger(type:'polling',enabled:'true',strategy:'periodically',
        frequency:'180') {
        repository(name:'#sourceRepo')
    }
    stage(name:'Default Stage') {
        job(key:'JOB1',name:'Default Job') {
            miscellaneousConfiguration() {
                pbc(enabled:'true',image:'docker.atl-paas.net/sox/#dockerContainer',
                size:'small')
            }
            task(type:'checkout',description:'Checkout Default Repository') {
                repository(name:'#sourceRepo')
            }
            task(type:'checkout',description:'Checkout #productRepo Repository') {
                repository(name:'#productRepo',checkoutDirectory:'product')
            }
            task(type:'script',description:'Install branch deploy',
                script:'services/bamboo-templates/branch-deploy-integrator/install-branch-deploy.sh',
                environmentVariables:'PRODUCT_CI_PLANURL="#productCiPlanUrl" PACKAGE_ENGINE="#packageEngine" PACKAGE_ENGINE_CMD="#integratorCmd" SKIP_INTEGRITY_CHECK="#skipIntegrityCheck"', interpreter:'RUN_AS_EXECUTABLE')
    }
    }
}